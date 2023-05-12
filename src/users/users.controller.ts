import {
  Get,
  Put,
  Param,
  Delete,
  UseGuards,
  Controller,
  ParseIntPipe,
  NotFoundException,
  Body,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { TCurrentUser } from './types/current-user.type';
import { ApiNotFoundResponseDto } from 'src/common/api-responses/ApiNotFoundResponse.dto';
import { ApiUnauthorizedResponseDto } from 'src/common/api-responses/ApiUnauthorizeResponse.dto';
import { ApiSuccessResponseDto } from 'src/common/api-responses/ApiSuccessResponseDto';

@UseGuards(JwtAuthGuard)
@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
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
      throw new NotFoundException(`No such user exists with id : ${userId}`);
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
    if (userId !== user.id) throw new UnauthorizedException();
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
