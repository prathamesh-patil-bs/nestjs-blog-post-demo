import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { SignInDto } from 'src/users/dtos/sign-in.dto';
import { User } from 'src/users/user.entity';

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
