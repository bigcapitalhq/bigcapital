import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  ILedgerAnalyticsReconcileJobPayload,
  LedgerAnalyticsReconcileQueue,
} from '../Analytics.constants';
import { ClickHouseSchemaService } from './ClickHouseSchema.service';

const RECONCILE_INTERVAL = 10 * 60 * 1000; // 10 minutes.
const FULL_RECONCILE_CRON = '0 3 * * *'; // Daily at 3 AM.

/**
 * Bootstraps the ClickHouse analytics integration: ensures the schema
 * exists and schedules the reconcile jobs.
 */
@Injectable()
export class LedgerAnalyticsBootstrap implements OnApplicationBootstrap {
  private readonly logger = new Logger('LedgerAnalytics');

  constructor(
    @InjectQueue(LedgerAnalyticsReconcileQueue)
    private readonly reconcileQueue: Queue,
    private readonly schemaService: ClickHouseSchemaService,
  ) {}

  /**
   * On application bootstrap, ensure the schema and schedule the reconcile jobs.
   */
  async onApplicationBootstrap(): Promise<void> {
    if (!this.schemaService.isEnabled()) return;

    try {
      await this.schemaService.ensureDatabase();
      await this.schemaService.ensureTables();
    } catch (error) {
      this.logger.warn(
        `Failed to ensure the ClickHouse schema: ${error.message}`,
      );
    }

    // Periodic reconcile that processes the dirty organizations.
    await this.reconcileQueue.add(
      'reconcile-dirty',
      {} as ILedgerAnalyticsReconcileJobPayload,
      {
        repeat: { every: RECONCILE_INTERVAL },
        removeOnComplete: true,
      },
    );

    // Daily full reconcile of all the initialized organizations.
    await this.reconcileQueue.add(
      'reconcile-all',
      { all: true } as ILedgerAnalyticsReconcileJobPayload,
      {
        repeat: { pattern: FULL_RECONCILE_CRON },
        removeOnComplete: true,
      },
    );
  }
}
