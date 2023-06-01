import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { User } from 'src/users/user.entity';

export class FakeUserService {
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
