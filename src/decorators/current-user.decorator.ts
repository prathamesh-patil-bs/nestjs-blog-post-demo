import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { TCurrentUser } from 'src/users/types/current-user.type';

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext): TCurrentUser => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return user;
  },
);
