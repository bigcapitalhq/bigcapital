import { Module } from '@nestjs/common';
import { createClient } from '@clickhouse/client';
import { ConfigService } from '@nestjs/config';
import { CLICKHOUSE_CLIENT } from './Analytics.constants';

const providers = [
  {
    provide: CLICKHOUSE_CLIENT,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const config = configService.get('clickhouse');

      return createClient({
        url: `http://${config.host}:${config.port}`,
        username: config.user,
        password: config.password,
        request_timeout: 10_000,
        clickhouse_settings: {
          // Wait for ALTER TABLE mutations (used by the reconcile job).
          mutations_sync: '2',
        },
      });
    },
  },
];

@Module({
  providers: [...providers],
  exports: [...providers],
})
export class ClickHouseClientModule {}
