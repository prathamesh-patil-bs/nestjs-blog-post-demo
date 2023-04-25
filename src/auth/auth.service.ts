import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { SignInDto } from 'src/users/dtos/sign-in.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

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
}
