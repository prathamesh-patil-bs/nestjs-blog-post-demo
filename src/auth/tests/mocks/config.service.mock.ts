export class ConfigServiceMock {
  private config = {
    JWT_SECRET: 'secret',
    SALT_ROUND: 10,
    JWT_AUDIENCE: 'xyz-audience',
    JWT_ISSUER: 'pqr-issuer',
  };

  get(key: string) {
    return this.config[key];
  }
}
