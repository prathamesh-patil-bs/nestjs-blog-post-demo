import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';

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
}
