import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { hash } from 'bcrypt';

import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { SignInDto } from 'src/users/dtos/sign-in.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { ForgotPasswordDto } from './dtos/forgot-passoword.dto';
import { ResetPasswordBodyDto } from './dtos/reset-password.dto';
import { JwtPayloadType } from './auth.type';
import { ChangePasswordDto } from './dtos/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  signUp(createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  async validateUser({ email, password }: SignInDto) {
    const existingUser = await this.userService.findUserByEmail(email);
    if (!existingUser) return null;

    const isValidPassword = await existingUser.validatePassword(password);
    if (!isValidPassword) return null;
    return existingUser;
  }

  async signIn(user: Omit<User, 'password'>) {
    const signInPayload = { userId: user.id };
    const signInOptions: JwtSignOptions = {
      expiresIn: '7d',
      subject: user.id.toString(),
    };
    const token = await this.jwtService.signAsync(signInPayload, signInOptions);
    return {
      access_token: `Bearer ${token}`,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const existingUser = await this.userService.findUserByEmail(email);
    if (!existingUser)
      throw new NotFoundException(`No such user is registered with "${email}"`);

    const jwtTokenSecret = this.configService.get<string>('JWT_SECRET');
    const secret = this.getPasswordTokenSigningSecret(
      jwtTokenSecret,
      existingUser.password,
    );

    const payload = {
      email: existingUser.email,
      id: existingUser.id,
    };

    const token = await this.jwtService.signAsync(
      payload,
      this.getTokenSignInOptions(existingUser.id, '15m', secret),
    );

    const domain = this.configService.get<string>('SERVER_DOMAIN');
    const passwordResetLink = `${domain}/api/auth/reset-password/${existingUser.id}/${token}`;
    return {
      passwordResetLink,
    };
  }

  async resetPassword(
    resetPasswordParamsDto: { id: number; token: string },
    resetPasswordBodyDto: ResetPasswordBodyDto,
  ) {
    const { password } = resetPasswordBodyDto;
    const { id, token } = resetPasswordParamsDto;

    let user = await this.userService.findUserById(id);

    if (!user) throw new BadRequestException('Invalid link!');

    const jwtTokenSecret = this.configService.get<string>('JWT_SECRET');
    const secret = this.getPasswordTokenSigningSecret(
      jwtTokenSecret,
      user.password,
    );

    try {
      const payload: JwtPayloadType = await this.jwtService.verifyAsync(token, {
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
      throw new BadRequestException('Invalid Link');
    }
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    currentUser: Omit<User, 'password'>,
  ) {
    const { oldPassword, newPassword } = changePasswordDto;

    const user = await this.userService.findUserById(currentUser.id);
    if (!user) throw new NotFoundException(`User doesn't exists!`);

    const isValidPassword = user.validatePassword(oldPassword);

    if (!isValidPassword) throw new BadRequestException(`Invalid password!`);

    user.password = await this.hashPasswrd(newPassword);
    this.userService.saveUser(user);

    return 'Password changed successfully!';
  }

  private getPasswordTokenSigningSecret(
    jwtSecret: string,
    userPassword: string,
  ) {
    return jwtSecret + userPassword;
  }

  private getTokenSignInOptions(
    subject: number,
    expiresIn: string,
    secret = '',
  ): JwtSignOptions {
    const payload = {
      expiresIn,
      subject: subject.toString(),
    };
    if (secret) payload['secret'] = secret;
    return payload;
  }

  private hashPasswrd(password: string): Promise<string> {
    const saltRounds = this.configService.get<number>('SALT_ROUND');
    return hash(password, saltRounds);
  }
}
