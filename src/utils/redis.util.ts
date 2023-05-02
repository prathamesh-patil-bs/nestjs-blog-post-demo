import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisUtils {
  client: Redis = null;
  constructor(private readonly redisService: RedisService) {
    this.client = redisService.getClient();
  }

  setValue(key: string, value: any, duration: number) {
    return this.client.setex(key, duration, value);
  }

  getValue(key: string) {
    return this.client.get(key);
  }
}
