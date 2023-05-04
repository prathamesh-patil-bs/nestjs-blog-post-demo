import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { RedisUtils } from './redis.util';
import { JwtHelper } from './jwt.util';

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
