import { User } from '@modules/users/user.entity';
import { CreateUserDto } from '@modules/users/dtos/create-user.dto';

export class UserServiceMock {
  users: User[] = [];

  createUser(createUserDto: CreateUserDto) {
    const user = new User({
      id: 1,
      ...createUserDto,
      role: 'user',
      validatePassword(pass: string) {
        return pass === this.password;
      },
    });

    this.users.push(user);
    return user;
  }

  findUserByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }

  findUserById(id: number) {
    return this.users.find((user) => user.id === id);
  }

  saveUser(user: User) {
    return user;
  }
}
