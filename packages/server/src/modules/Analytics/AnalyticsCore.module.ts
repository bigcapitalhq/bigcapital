import { Module } from '@nestjs/common';
import { ClickHouseClientModule } from './ClickHouseClient.module';
import { ClickHouseSchemaService } from './services/ClickHouseSchema.service';
import { TenantConnectionFactory } from './services/TenantConnectionFactory';
import { LedgerAnalyticsSyncService } from './services/LedgerAnalyticsSync.service';

/**
 * Bull-free core of the analytics integration. Can be used by the CLI
 * and the workspaces financials without starting the Bull workers.
 */
@Module({
  imports: [ClickHouseClientModule],
  providers: [
    ClickHouseSchemaService,
    TenantConnectionFactory,
    LedgerAnalyticsSyncService,
  ],
  exports: [
    ClickHouseSchemaService,
    TenantConnectionFactory,
    LedgerAnalyticsSyncService,
  ],
})
export class AnalyticsCoreModule {}
