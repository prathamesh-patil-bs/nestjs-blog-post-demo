import { TCurrentUser } from 'src/users/types/current-user.type';
import { User } from 'src/users/user.entity';

declare module 'express' {
  export interface Request {
    user: TCurrentUser;
  }
}

declare module 'express-serve-static-core' {
  export interface Request {
    user: TCurrentUser;
  }
}
