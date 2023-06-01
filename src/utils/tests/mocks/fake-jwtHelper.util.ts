import { JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { JwtPayloadType } from 'src/auth/types/auth.type';

export class FakeJwtHelper {
  signAccessToken(
    tokenPaylod: { [key: string]: any },
    jwtSignOptions: JwtSignOptions,
  ) {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTY4NTAwNjM4NiwiZXhwIjoxNjg1NjExMTg2LCJhdWQiOiJodHRwOi8vbG9jYWxob3N0IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwic3ViIjoiMyJ9.47ukDZtOju2rrsOyj5HPbJxP8p6PRFyxjA8XYE-jeK8';
  }

  signRefreshToken(
    tokenPayload: { [key: string]: any },
    jwtSignOptions: JwtSignOptions,
  ) {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTY4NTAwNjM4NiwiZXhwIjoxNjg1NjExMTg2LCJhdWQiOiJodHRwOi8vbG9jYWxob3N0IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwic3ViIjoiMyJ9.47ukDZtOju2rrsOyj5HPbJxP8p6PRFyxjA8XYE-jeK8';
  }

  verifyToken(
    token: string,
    verifyOptions: JwtVerifyOptions = {},
  ): Promise<JwtPayloadType> {
    if (token === 'pass') {
      return Promise.resolve({
        userId: 1,
        iat: 2564,
        exp: 12345,
        iss: 'string',
        sub: 'string',
        aud: 'string',
      });
    }

    if (token === 'fail') {
      throw new Error();
    }
  }
}
