import { User } from 'src/users/user.entity';

declare module 'express' {
  export interface Request {
    user: Omit<User, 'password'>;
  }
}

declare module 'express-serve-static-core' {
  export interface Request {
    user: Omit<User, 'password'>;
  }
}
