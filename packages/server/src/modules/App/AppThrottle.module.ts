import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { getAppThrottlers } from './AppThrottle.throttlers';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Use in-memory storage with very high limits for test environment
        const isTest =
          process.env.NODE_ENV === 'test' ||
          process.env.JEST_WORKER_ID !== undefined;

        if (isTest) {
          return {
            // Very high limits effectively disable throttling in tests.
            throttlers: getAppThrottlers({
              globalTtl: 60000,
              globalLimit: 1000000,
              authTtl: 60000,
              authLimit: 1000000,
            }),
            // No storage specified = uses in-memory storage
          };
        }

        const host = configService.get<string>('redis.host') || 'localhost';
        const port = Number(configService.get<number>('redis.port') || 6379);
        const password = configService.get<string>('redis.password');
        const db = configService.get<number>('redis.db');

        const globalTtl = configService.get<number>('throttle.global.ttl');
        const globalLimit = configService.get<number>('throttle.global.limit');
        const authTtl = configService.get<number>('throttle.auth.ttl');
        const authLimit = configService.get<number>('throttle.auth.limit');

        return {
          throttlers: getAppThrottlers({
            globalTtl,
            globalLimit,
            authTtl,
            authLimit,
          }),
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
export class AppThrottleModule {}
