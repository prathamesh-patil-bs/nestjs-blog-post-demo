import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import _ from 'lodash';

import { JwtHelper } from '../utils/jwt.util';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { SignInDto } from 'src/users/dtos/sign-in.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { ForgotPasswordDto } from './dtos/forgot-passoword.dto';
import { ResetPasswordBodyDto } from './dtos/reset-password.dto';
import { JwtPayloadType } from './types/auth.type';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { RedisUtils } from 'src/utils/redis.util';
import { TCurrentUser } from 'src/users/types/current-user.type';
import { SignInResponseDto } from './dtos/signIn-response.dto';
import { ForgotPasswordResponseDto } from './dtos/forgot-password-response.dto';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtHelper: JwtHelper,
    private readonly redisUtils: RedisUtils,
  ) {}

  signUp(createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  async validateUser({ email, password }: SignInDto) {
    const existingUser = await this.userService.findUserByEmail(email);
    if (!existingUser) return null;

    const isValidPassword = await existingUser.validatePassword(password);
    if (!isValidPassword) return null;
    return _.pick(existingUser, [
      'id',
      'firstName',
      'lastName',
      'email',
      'role',
    ]);
  }

  async signIn(user: TCurrentUser): Promise<SignInResponseDto> {
    const signInPayload = { userId: user.id };

    const accessTokenSignInOptions: JwtSignOptions = {
      expiresIn: '7d',
      subject: user.id.toString(),
    };
    const refreshTokenSignInOptions: JwtSignOptions = {
      expiresIn: '365d',
      subject: user.id.toString(),
    };

    const accessToken = await this.jwtHelper.signAccessToken(
      signInPayload,
      accessTokenSignInOptions,
    );
    const refreshToken = await this.jwtHelper.signRefreshToken(
      signInPayload,
      refreshTokenSignInOptions,
    );

    return {
      accessToken: `Bearer ${accessToken}`,
      refreshToken,
    };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    const { email } = forgotPasswordDto;
    const existingUser = await this.userService.findUserByEmail(email);

    if (!existingUser) {
      this.logger.warn(
        'Trying to reset password with email.',
        forgotPasswordDto,
      );
      throw new NotFoundException(`No such user found with "${email}"`);
    }

    const jwtTokenSecret = this.configService.get<string>('JWT_SECRET');
    const secret = this.getPasswordTokenSigningSecret(
      jwtTokenSecret,
      existingUser.password,
    );

    const payload = {
      email: existingUser.email,
      userId: existingUser.id,
    };

    const token = await this.jwtHelper.signAccessToken(payload, {
      subject: existingUser.id.toString(),
      expiresIn: '15m',
      secret,
    });

    const domain = this.configService.get<string>('SERVER_DOMAIN');
    const passwordResetLink = `${domain}/api/auth/reset-password/${existingUser.id}/${token}`;
    return {
      passwordResetLink,
    };
  }

  async resetPassword(
    resetPasswordParamsDto: { id: number; token: string },
    resetPasswordBodyDto: ResetPasswordBodyDto,
  ): Promise<void> {
    const { password } = resetPasswordBodyDto;
    const { id, token } = resetPasswordParamsDto;

    let user = await this.userService.findUserById(id);

    if (!user) {
      this.logger.warn(
        `Trying to reset password with invalid {id} & {token}`,
        resetPasswordParamsDto,
      );
      throw new BadRequestException('Invalid link!');
    }

    const jwtTokenSecret = this.configService.get<string>('JWT_SECRET');
    const secret = this.getPasswordTokenSigningSecret(
      jwtTokenSecret,
      user.password,
    );

    try {
      const payload: JwtPayloadType = await this.jwtHelper.verifyToken(token, {
        secret,
      });

      user = await this.userService.findUserById(payload.userId);

      if (user) {
        user.password = await this.hashPasswrd(password);
        await this.userService.saveUser(user);
      } else {
        throw new BadRequestException('Invalid token!');
      }
    } catch (error) {
      this.logger.error('Error in reset password api', error);
      throw new BadRequestException('Invalid link!');
    }
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    currentUser: TCurrentUser,
  ): Promise<string> {
    const { oldPassword, newPassword } = changePasswordDto;

    const user = await this.userService.findUserById(currentUser.id);
    const isValidPassword = user.validatePassword(oldPassword);

    if (!isValidPassword) {
      this.logger.warn(
        `User with id : ${currentUser.id} is trying to change password with wrong old password`,
      );
      throw new BadRequestException(`Invalid password!`);
    }

    user.password = await this.hashPasswrd(newPassword);
    this.userService.saveUser(user);

    return 'Password changed successfully!';
  }

  async getAccessTokenUsingRefreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { userId } = await this.jwtHelper.verifyToken(refreshToken);
    const storedToken = await this.redisUtils.getValue(userId.toString());

    if (storedToken !== refreshToken) {
      this.logger.warn('Trying to use old refresh token');
      throw new UnauthorizedException();
    }

    const accessTokenSignInOptions: JwtSignOptions = {
      expiresIn: '7d',
      subject: userId.toString(),
    };
    const refreshTokenSignInOptions: JwtSignOptions = {
      expiresIn: '365d',
      subject: userId.toString(),
    };

    const accessToken = await this.jwtHelper.signAccessToken(
      { userId },
      accessTokenSignInOptions,
    );

    refreshToken = await this.jwtHelper.signRefreshToken(
      { userId },
      refreshTokenSignInOptions,
    );

    return {
      accessToken: 'Bearer ' + accessToken,
      refreshToken,
    };
  }

  private getPasswordTokenSigningSecret(
    jwtSecret: string,
    userPassword: string,
  ) {
    return jwtSecret + userPassword;
  }

  private hashPasswrd(password: string): Promise<string> {
    const saltRounds = this.configService.get<number>('SALT_ROUND');
    return hash(password, saltRounds);
  }

  logoutUser(user: TCurrentUser) {
    return this.redisUtils.deleteValue(user.id.toString());
  }
}
