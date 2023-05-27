import { User } from '../user.entity';

export type TCurrentUser = Pick<
  User,
  'email' | 'id' | 'firstName' | 'lastName' | 'role'
>;
