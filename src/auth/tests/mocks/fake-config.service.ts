export class FakeConfigService {
  private config = {
    JWT_SECRET: 'secret',
    SALT_ROUND: 10,
  };

  get(key: string) {
    return this.config[key];
  }
}
