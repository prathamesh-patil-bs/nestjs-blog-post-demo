/* eslint-disable @typescript-eslint/no-unused-vars */
export class RedisUtilsMock {
  deleteValue(key: string) {
    return Promise.resolve(1);
  }

  getValue(key: string) {
    return key === '1' ? 'fail' : null;
  }
}
