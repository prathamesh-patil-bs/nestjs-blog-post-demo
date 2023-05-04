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
} from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { TCurrentUser } from './types/current-user.type';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @Serialize(UserDto)
  getUsers(): Promise<Array<User>> {
    return this.userService.fetchUsers();
  }

  @Get(':userId')
  @Serialize(UserDto)
  async getUserById(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<User> {
    const user = await this.userService.findUserById(userId);
    if (!user)
      throw new NotFoundException(`No such user exists with id : ${userId}`);
    return user;
  }

  @Put(':userId')
  @Serialize(UserDto)
  updateUserInfo(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: TCurrentUser,
  ): Promise<User> {
    if (userId !== user.id) throw new UnauthorizedException();
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Delete(':userId')
  deleteUser(
    @CurrentUser() user: TCurrentUser,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<{ message: string }> {
    return this.userService.deleteUser(user, userId);
  }
}
