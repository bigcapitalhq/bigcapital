import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('redis.host') || 'localhost';
        const port = Number(configService.get<number>('redis.port') || 6379);
        const password = configService.get<string>('redis.password');
        const db = configService.get<number>('redis.db');

        const globalTtl = configService.get<number>('throttle.global.ttl');
        const globalLimit = configService.get<number>('throttle.global.limit');
        const authTtl = configService.get<number>('throttle.auth.ttl');
        const authLimit = configService.get<number>('throttle.auth.limit');

        return {
          throttlers: [
            {
              name: 'default',
              ttl: globalTtl,
              limit: globalLimit,
            },
            {
              name: 'auth',
              ttl: authTtl,
              limit: authLimit,
            },
          ],
          storage: new ThrottlerStorageRedisService({
            host,
            port,
            password,
            db,
          }),
        };
      },
    }),
  ],
})
export class AppThrottleModule { }


