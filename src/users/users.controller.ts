import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @Serialize(UserDto)
  getUsers(): Promise<Array<User>> {
    return this.userService.fetchUsers();
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) userId: number): Promise<User> {
    const user = await this.userService.findUserById(userId);
    if (!user)
      throw new NotFoundException(`No such user exists with given id.`);
    return user;
  }
}
