import { User } from '../user.entity';

export type TCurrentUser = Omit<User, 'password'>;
