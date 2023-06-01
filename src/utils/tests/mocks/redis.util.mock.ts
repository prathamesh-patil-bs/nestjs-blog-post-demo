export class RedisUtilsMock {
  deleteValue(key: string) {
    return Promise.resolve(1);
  }

  getValue(key: string) {
    return key === '1' ? 'fail' : null;
  }
}
