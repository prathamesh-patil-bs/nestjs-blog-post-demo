import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';

import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UtilsModule } from 'src/utils/util.module';

@Module({
  imports: [UsersModule, UtilsModule],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
