import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateUser({
      email: username,
      password,
    });

    if (!user) {
      this.logger.warn(`Tried to login with envalid credentials`, {
        email: username,
        password,
      });
      throw new UnauthorizedException('Invalid Credentials!');
    }
    return user;
  }
}
