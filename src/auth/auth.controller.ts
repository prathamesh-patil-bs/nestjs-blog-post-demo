import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
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
import { SignInResponseDto } from './dtos/signIn-response.dto';
import { ApiUnauthorizedResponseDto } from 'src/common/api-responses/ApiUnauthorizeResponse.dto';
import { ForgotPasswordResponseDto } from './dtos/forgot-password-response.dto';
import { ApiNotFoundResponseDto } from 'src/common/api-responses/ApiNotFoundResponse.dto';
import { ApiBadRequestResponseDto } from 'src/common/api-responses/ApiBadRequestResponseDto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  @Serialize(UserDto)
  @ApiResponse({
    description: 'Newly Created User',
    type: UserDto,
    status: 201,
  })
  @ApiConflictResponse({
    description: 'User with email already exists!',
  })
  signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.signUp(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/sign-in')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Api access credentials.',
    type: SignInResponseDto,
  })
  @ApiUnauthorizedResponse({ type: ApiUnauthorizedResponseDto })
  signIn(@Req() req: Request): Promise<SignInResponseDto> {
    return this.authService.signIn(req.user);
  }

  @Post('/forgot-password')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Password reset link',
    type: ForgotPasswordResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Resource not found',
    type: ApiNotFoundResponseDto,
  })
  forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('/reset-password/:id/:token')
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Id of user.', example: 1 })
  @ApiParam({
    name: 'token',
    description: 'Token sent in response of forgot password',
    example: 'w6OvJaI83ln6uLLc7yRT2VHoDQ1_ShY43M4oTD3XpPo',
  })
  @ApiResponse({
    description: 'Success response of password reset.',
    status: 200,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request exception',
    type: ApiBadRequestResponseDto,
  })
  resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Param('token') token: string,
    @Body() resetPasswordBodyDto: ResetPasswordBodyDto,
  ): Promise<void> {
    return this.authService.resetPassword({ id, token }, resetPasswordBodyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change-password')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success message of password change.',
  })
  @ApiBadRequestResponse({ type: ApiBadRequestResponseDto })
  @ApiNotFoundResponse({ type: ApiNotFoundResponseDto })
  changePassword(
    @CurrentUser() user: TCurrentUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<string> {
    return this.authService.changePassword(changePasswordDto, user);
  }

  @Post('/refresh-token')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Api access credentials.',
    type: SignInResponseDto,
  })
  @ApiBadRequestResponse({ type: ApiBadRequestResponseDto })
  @ApiUnauthorizedResponse({ type: ApiUnauthorizedResponseDto })
  getAccessToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<SignInResponseDto> {
    if (!refreshToken) {
      throw new BadRequestException('refreshToken is required!');
    }

    return this.authService.getAccessTokenUsingRefreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ type: ApiUnauthorizedResponseDto })
  @ApiResponse({ description: 'Success response of logout.', status: 200 })
  logout(@CurrentUser() user: TCurrentUser): Promise<number> {
    return this.authService.logoutUser(user);
  }
}
