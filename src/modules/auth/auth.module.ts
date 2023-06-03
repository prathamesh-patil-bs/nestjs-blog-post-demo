import { Module } from '@nestjs/common';

import { UtilsModule } from '@utils/util.module';
import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy';
import { AuthService } from '@modules/auth/auth.service';
import { UsersModule } from '@modules/users/users.module';
import { LocalStrategy } from '@/modules/auth/strategies/local.strategy';
import { AuthController } from '@modules/auth/auth.controller';

@Module({
  imports: [UsersModule, UtilsModule],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
