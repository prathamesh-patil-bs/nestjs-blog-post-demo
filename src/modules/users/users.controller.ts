import {
  Get,
  Put,
  Body,
  Param,
  Logger,
  Delete,
  HttpCode,
  UseGuards,
  Controller,
  ParseIntPipe,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { User } from '@modules/users/user.entity';
import { UserDto } from '@modules/users/dtos/user.dto';
import { UsersService } from '@modules/users/users.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { Serialize } from '@interceptors/serialize.interceptor';
import { CurrentUser } from '@decorators/current-user.decorator';
import { UpdateUserDto } from '@modules/users/dtos/update-user.dto';
import { TCurrentUser } from '@modules/users/typings/current-user.type';
import { ApiSuccessResponseDto } from '@common/api-responses/ApiSuccessResponseDto';
import { ApiNotFoundResponseDto } from '@common/api-responses/ApiNotFoundResponse.dto';
import { ApiUnauthorizedResponseDto } from '@common/api-responses/ApiUnauthorizeResponse.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  private logger = new Logger(UsersController.name);

  constructor(private readonly userService: UsersService) {}

  @Get()
  @Serialize(UserDto)
  @ApiResponse({
    description: 'Returns the list of users.',
    isArray: true,
    type: UserDto,
    status: 200,
  })
  @ApiUnauthorizedResponse({ type: ApiUnauthorizedResponseDto })
  getUsers(): Promise<Array<User>> {
    return this.userService.fetchUsers();
  }

  @Get(':userId')
  @Serialize(UserDto)
  @ApiParam({ name: 'userId', description: 'Id of the user.' })
  @ApiResponse({
    description: 'Returns the user found by id.',
    type: UserDto,
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'User not found exception',
    type: ApiNotFoundResponseDto,
  })
  @ApiUnauthorizedResponse({ type: ApiUnauthorizedResponseDto })
  async getUserById(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<User> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      {
        this.logger.warn("Trying to access user which doesn't exists", {
          userId,
        });
        throw new NotFoundException(`No such user exists with id : ${userId}`);
      }
    }
    return user;
  }

  @Put(':userId')
  @Serialize(UserDto)
  @HttpCode(200)
  @ApiParam({ name: 'userId', description: 'Id of the user.' })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated user object.',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({ type: ApiUnauthorizedResponseDto })
  @ApiNotFoundResponse({ type: ApiNotFoundResponseDto })
  updateUserInfo(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: TCurrentUser,
  ): Promise<User> {
    if (userId !== user.id) {
      this.logger.warn("Trying to update another user's info", {
        currentUser: user,
        userId,
      });
      throw new UnauthorizedException();
    }
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Delete(':userId')
  @HttpCode(200)
  @ApiParam({ name: 'userId', description: 'Id of the user.' })
  @ApiResponse({
    status: 200,
    type: ApiSuccessResponseDto,
    description: 'Success message of user deletion.',
  })
  @ApiNotFoundResponse({ type: ApiNotFoundResponseDto })
  @ApiUnauthorizedResponse({ type: ApiUnauthorizedResponseDto })
  deleteUser(
    @CurrentUser() user: TCurrentUser,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<{ message: string }> {
    return this.userService.deleteUser(user, userId);
  }
}
