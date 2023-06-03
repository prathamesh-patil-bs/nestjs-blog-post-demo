import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';

import { JwtHelper } from '@utils//jwt.util';
import { RedisUtils } from '@utils/redis.util';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            audience: configService.get<string>('JWT_AUDIENCE'),
            issuer: configService.get<string>('JWT_ISSUER'),
          },
        };
      },
    }),
  ],
  providers: [JwtHelper, RedisUtils],
  exports: [JwtHelper, RedisUtils],
})
export class UtilsModule {}
