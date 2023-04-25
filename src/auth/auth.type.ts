export type JwtPayloadType = {
  userId: number;
  iat: number;
  exp: number;
  iss: string;
  sub: string;
  aud: string;
};
