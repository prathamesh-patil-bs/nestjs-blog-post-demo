import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './users.repository';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PostsService } from 'src/posts/posts.service';
import { CommentsService } from 'src/comments/comments.service';
import { TCurrentUser } from './types/current-user.type';
import { USER_ROLE } from 'src/common/app.constants';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly postService: PostsService,
    private readonly commentService: CommentsService,
  ) {}

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

  saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(userId);
    if (!user)
      throw new NotFoundException(`No such user found with ${userId} id.`);

    return this.userRepository.save({ ...user, ...updateUserDto });
  }

  async deleteUser(
    user: TCurrentUser,
    userId: number,
  ): Promise<{ message: string }> {
    const userInfo = await this.findUserById(userId);

    if (!userInfo) {
      throw new NotFoundException(`No such user found with id : ${userId}`);
    }

    const isUserAdmin = user.role === USER_ROLE.ADMIN;
    const isUserOwnsThisAccount = user.id === userId;

    if (!isUserAdmin && !isUserOwnsThisAccount) {
      throw new UnauthorizedException(
        `You don't have sufficient access to delete this user.`,
      );
    }

    await this.userRepository.delete({ id: userId });

    return { message: 'User delete successfully.' };
  }
}
