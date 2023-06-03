import { Redis } from 'ioredis';
import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class RedisUtils {
  client: Redis = null;
  constructor(private readonly redisService: RedisService) {
    this.client = redisService.getClient();
  }

  setValue(key: string, value: any, duration: number): Promise<'OK'> {
    return this.client.setex(key, duration, value);
  }

  getValue(key: string): Promise<string> {
    return this.client.get(key);
  }

  deleteValue(key: string): Promise<number> {
    return this.client.del([key]);
  }
}
