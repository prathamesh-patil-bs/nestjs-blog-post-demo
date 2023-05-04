import { registerAs } from '@nestjs/config';

export default registerAs('appConstant', () => ({
  ACCESS_TOKEN_EXPIRY_TIME: 24 * 60 * 60,
  REFRESH_TOKEN_EXPIRY_TIME: 365 * 24 * 60 * 60,
}));
