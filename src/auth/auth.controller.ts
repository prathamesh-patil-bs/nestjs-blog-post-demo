import {
  BadRequestException,
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
import { TCurrentUser } from 'src/users/types/current-user.type';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Serialize(UserDto)
  @Post('/sign-up')
  signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.signUp(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/sign-in')
  signIn(@Req() req: Request): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    return this.authService.signIn(req.user);
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
    console.log('ID ==> ', id);
    console.log('TOKEN ==> ', token);
    return this.authService.resetPassword({ id, token }, resetPasswordBodyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change-password')
  changePassword(
    @CurrentUser() user: TCurrentUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(changePasswordDto, user);
  }

  @Post('/refresh-token')
  getAccessToken(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken)
      throw new BadRequestException('refreshToken is required');

    return this.authService.getAccessTokenUsingRefreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  logout(@CurrentUser() user: TCurrentUser) {
    return this.authService.logoutUser(user);
  }
}
