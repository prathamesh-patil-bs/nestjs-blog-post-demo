import { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { TCurrentUser } from '@modules/users/typings/current-user.type';

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext): TCurrentUser => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return user;
  },
);
