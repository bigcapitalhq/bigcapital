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
        // Use in-memory storage with very high limits for test environment
        const isTest = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;

        if (isTest) {
          return {
            throttlers: [
              {
                name: 'default',
                ttl: 60000,
                limit: 1000000, // Effectively disable throttling in tests
              },
              {
                name: 'auth',
                ttl: 60000,
                limit: 1000000, // Effectively disable throttling in tests
              },
            ],
            // No storage specified = uses in-memory storage
          };
        }

        const host = configService.get<string>('redis.host') || 'localhost';
        const port = Number(configService.get<number>('redis.port') || 6379);
        const password = configService.get<string>('redis.password');
        const db = configService.get<number>('redis.db');

        // Ensure we always have valid numbers with fallback defaults
        const globalTtl = configService.get<number>('throttle.global.ttl') ?? 60000;
        const globalLimit = configService.get<number>('throttle.global.limit') ?? 100;
        const authTtl = configService.get<number>('throttle.auth.ttl') ?? 60000;
        const authLimit = configService.get<number>('throttle.auth.limit') ?? 10;

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


