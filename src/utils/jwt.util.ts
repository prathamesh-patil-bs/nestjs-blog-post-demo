import { Injectable } from '@nestjs/common';
import { RedisUtils } from './redis.util';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { JwtPayloadType } from 'src/auth/auth.type';

@Injectable()
export class JwtHelper {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisUtils: RedisUtils,
    private readonly jwtService: JwtService,
  ) {}

  signAccessToken(
    tokenPaylod: { [key: string]: any },
    jwtSignOptions: JwtSignOptions,
  ) {
    const ACCESS_TOKEN_EXPIRY_TIME = this.configService.get<number>(
      'appConstant.ACCESS_TOKEN_EXPIRY_TIME',
    );
    return this.jwtService.signAsync(tokenPaylod, {
      expiresIn: ACCESS_TOKEN_EXPIRY_TIME,
      ...jwtSignOptions,
    });
  }

  async signRefreshToken(
    tokenPayload: { [key: string]: any },
    jwtSignOptions: JwtSignOptions,
  ) {
    const { userId } = tokenPayload;
    const REFRESH_TOKEN_EXPIRY_TIME = this.configService.get<number>(
      'appConstant.REFRESH_TOKEN_EXPIRY_TIME',
    );

    const refreshToken = await this.jwtService.signAsync(tokenPayload, {
      expiresIn: REFRESH_TOKEN_EXPIRY_TIME,
      ...jwtSignOptions,
    });

    await this.redisUtils.setValue(
      userId.toString(),
      refreshToken,
      REFRESH_TOKEN_EXPIRY_TIME,
    );

    return refreshToken;
  }

  verifyToken(
    token: string,
    verifyOptions: JwtVerifyOptions = {},
  ): Promise<JwtPayloadType> {
    const secret = this.configService.get<string>('JWT_SECRET');
    return this.jwtService.verifyAsync(token, { secret, ...verifyOptions });
  }
}
