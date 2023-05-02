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
} from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

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
  async getUserById(@Param('id', ParseIntPipe) userId: number): Promise<User> {
    const user = await this.userService.findUserById(userId);
    if (!user)
      throw new NotFoundException(`No such user exists with given id.`);
    return user;
  }

  @Put(':userId')
  @Serialize(UserDto)
  updateUserInfo(
    @Param('id', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, updateUserDto);
  }

  // @Delete(':userId')
  // deleteUser() {}
}
