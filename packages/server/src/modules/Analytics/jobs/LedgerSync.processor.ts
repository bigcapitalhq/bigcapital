import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import {
  ILedgerAnalyticsSyncJobPayload,
  LedgerAnalyticsSyncQueue,
} from '../Analytics.constants';
import { LedgerAnalyticsSyncService } from '../services/LedgerAnalyticsSync.service';
import { TenantConnectionFactory } from '../services/TenantConnectionFactory';
import { LedgerAnalyticsDirtySet } from '../services/LedgerAnalyticsDirtySet.service';

@Processor({ name: LedgerAnalyticsSyncQueue })
export class LedgerSyncProcessor extends WorkerHost {
  private readonly logger = new Logger('LedgerAnalytics');

  constructor(
    private readonly syncService: LedgerAnalyticsSyncService,
    private readonly tenantConnectionFactory: TenantConnectionFactory,
    private readonly dirtySet: LedgerAnalyticsDirtySet,
  ) {
    super();
  }

  /**
   * Processes the ledger sync job: upserts the accounts dimensions
   * and inserts the ledger deltas of the organization.
   * @param {Job<ILedgerAnalyticsSyncJobPayload>} job
   */
  async process(job: Job<ILedgerAnalyticsSyncJobPayload>): Promise<void> {
    const { organizationId, deltas, accountIds } = job.data;

    try {
      if (accountIds.length > 0) {
        const tenantKnex =
          this.tenantConnectionFactory.getTenantKnex(organizationId);
        try {
          await this.syncService.syncAccountsDim(
            organizationId,
            tenantKnex,
            accountIds,
          );
        } catch (error) {
          // Dimensions can be repaired by the reconcile job, don't fail
          // the whole job because of a missing dimension row.
          this.logger.warn(
            `Failed to sync accounts dim of org ${organizationId}: ${error.message}`,
          );
        }
      }
      await this.syncService.insertLedgerDeltas(organizationId, deltas);
      await this.dirtySet.unmark(organizationId);
    } catch (error) {
      this.logger.warn(
        `Failed to sync ledger deltas of org ${organizationId}: ${error.message}`,
      );
      // Mark the organization as dirty so the reconcile job rebuilds it.
      await this.dirtySet.mark(organizationId);
      throw error;
    }
  }
}
