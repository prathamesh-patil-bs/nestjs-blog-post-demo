import { User } from '@modules/users/user.entity';
import { SignInDto } from '@modules/users/dtos/sign-in.dto';
import { CreateUserDto } from '@modules/users/dtos/create-user.dto';

export class AuthServiceMock {
  users: User[] = [];

  validateUser(singInDto: SignInDto) {
    const { email, password } = singInDto;
    const user = this.users.find((user) => user.email === email);
    if (!user) return null;

    if (user.password !== password) return null;

    return user;
  }

  signUp(createUserDto: CreateUserDto) {
    const user = new User({ id: 1, ...createUserDto, role: 'user' });
    this.users.push(user);
    return user;
  }
}
