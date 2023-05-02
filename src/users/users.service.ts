import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './users.repository';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, ...rest } = createUserDto;
    const existingUser = await this.userRepository.countBy({ email });
    if (existingUser)
      throw new ConflictException(`User with email "${email}" already exists!`);
    return this.userRepository.createUser({ email, ...rest });
  }

  fetchUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  findUserById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  saveUser(user: User) {
    return this.userRepository.save(user);
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(userId);
    if (!user)
      throw new NotFoundException(`No such user found with ${userId}.`);

    return this.userRepository.save({ ...user, ...updateUserDto });
  }
}
