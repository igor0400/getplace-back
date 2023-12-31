import { Inject, Logger, Module, OnModuleInit } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { RedisCacheService } from './redis.service';
import { CacheModule, CACHE_MANAGER } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          store: redisStore,
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
          ttl: 60 * 60,
        };
      },
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheModule, RedisCacheService],
})
export class RedisCacheModule implements OnModuleInit {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}
  public onModuleInit(): any {
    const logger = new Logger('Cache');
  }
}
