import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import {
  LedgerAnalyticsReconcileQueue,
  LedgerAnalyticsSyncQueue,
} from './Analytics.constants';
import { AnalyticsCoreModule } from './AnalyticsCore.module';
import { LedgerClickHouseSink } from './services/LedgerClickHouseSink.service';
import { LedgerAnalyticsDirtySet } from './services/LedgerAnalyticsDirtySet.service';
import { LedgerAnalyticsBootstrap } from './services/LedgerAnalyticsBootstrap.service';
import { LedgerSyncProcessor } from './jobs/LedgerSync.processor';
import { LedgerReconcileProcessor } from './jobs/LedgerReconcile.processor';

/**
 * Analytics integration with ClickHouse: dual-write sink of the ledger
 * writes, reconcile jobs and the workspaces financial totals.
 */
@Module({
  imports: [
    AnalyticsCoreModule,
    BullModule.registerQueue(
      { name: LedgerAnalyticsSyncQueue },
      { name: LedgerAnalyticsReconcileQueue },
    ),
  ],
  providers: [
    LedgerClickHouseSink,
    LedgerAnalyticsDirtySet,
    LedgerAnalyticsBootstrap,
    LedgerSyncProcessor,
    LedgerReconcileProcessor,
  ],
  exports: [LedgerClickHouseSink],
})
export class AnalyticsModule {}
