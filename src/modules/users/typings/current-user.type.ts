import { User } from '@modules/users/user.entity';

export type TCurrentUser = Pick<
  User,
  'email' | 'id' | 'firstName' | 'lastName' | 'role'
>;
