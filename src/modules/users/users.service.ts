import {
  Logger,
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

import { User } from '@modules/users/user.entity';
import { USER_ROLE } from '@common/app.constants';
import { UserRepository } from '@modules/users/users.repository';
import { CreateUserDto } from '@modules/users/dtos/create-user.dto';
import { UpdateUserDto } from '@modules/users/dtos/update-user.dto';
import { TCurrentUser } from '@modules/users/typings/current-user.type';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, ...rest } = createUserDto;
    const existingUser = await this.userRepository.countBy({ email });

    if (existingUser) {
      this.logger.warn(`Tried to signup with existing email ${email}`);
      throw new ConflictException(`User with email "${email}" already exists!`);
    }

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

  saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(userId);
    if (!user) {
      this.logger.warn("Trying to access user which doesn't exists!", {
        userId,
      });
      throw new NotFoundException(`No such user found with ${userId} id.`);
    }

    return this.userRepository.save({ ...user, ...updateUserDto });
  }

  async deleteUser(
    user: TCurrentUser,
    userId: number,
  ): Promise<{ message: string }> {
    const userInfo = await this.findUserById(userId);

    if (!userInfo) {
      this.logger.warn("Trying to access user which doesn't exists!", {
        userId,
      });
      throw new NotFoundException(`No such user found with id : ${userId}`);
    }

    const isUserAdmin = user.role === USER_ROLE.ADMIN;
    const isUserOwnsThisAccount = user.id === userId;

    if (!isUserAdmin && !isUserOwnsThisAccount) {
      this.logger.warn('Trying to delete others account', {
        currentUser: user,
        deletionUserId: userId,
      });
      throw new UnauthorizedException(
        `You don't have sufficient access to delete this user.`,
      );
    }

    await this.userRepository.delete({ id: userId });
    return { message: 'User delete successfully.' };
  }
}
