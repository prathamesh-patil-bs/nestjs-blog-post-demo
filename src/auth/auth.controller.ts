import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { ForgotPasswordDto } from './dtos/forgot-passoword.dto';
import { ResetPasswordBodyDto } from './dtos/reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/sign-in')
  signIn(@Req() req: Request) {
    return this.authService.signIn(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/token')
  getPayload(@CurrentUser() user: Omit<User, 'password'>) {
    return user;
  }

  @Post('/forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('/reset-password/:id/:token')
  resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Param('token') token: string,
    @Body() resetPasswordBodyDto: ResetPasswordBodyDto,
  ) {
    return this.authService.resetPassword({ id, token }, resetPasswordBodyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change-password')
  changePassword(
    @CurrentUser() user: Omit<User, 'password'>,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(changePasswordDto, user);
  }
}
