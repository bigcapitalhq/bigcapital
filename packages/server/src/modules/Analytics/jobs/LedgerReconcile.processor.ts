import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import knex, { Knex } from 'knex';
import { ConfigService } from '@nestjs/config';
import {
  ILedgerAnalyticsReconcileJobPayload,
  LedgerAnalyticsReconcileQueue,
} from '../Analytics.constants';
import { LedgerAnalyticsSyncService } from '../services/LedgerAnalyticsSync.service';
import { LedgerAnalyticsDirtySet } from '../services/LedgerAnalyticsDirtySet.service';

@Processor({ name: LedgerAnalyticsReconcileQueue })
export class LedgerReconcileProcessor extends WorkerHost {
  private readonly logger = new Logger('LedgerAnalytics');

  constructor(
    private readonly syncService: LedgerAnalyticsSyncService,
    private readonly configService: ConfigService,
    private readonly dirtySet: LedgerAnalyticsDirtySet,
  ) {
    super();
  }

  /**
   * Processes the reconcile job: rebuilds the organizations data in
   * ClickHouse from their tenant databases.
   * @param {Job<ILedgerAnalyticsReconcileJobPayload>} job
   */
  async process(job: Job<ILedgerAnalyticsReconcileJobPayload>): Promise<void> {
    const { organizationId, all } = job.data;

    if (all) {
      await this.reconcileAllTenants();
      return;
    }
    if (organizationId) {
      await this.reconcileOrganization(organizationId);
      return;
    }
    await this.reconcileDirtyOrganizations();
  }

  /**
   * Reconciles the organizations that were marked as dirty.
   */
  private async reconcileDirtyOrganizations(): Promise<void> {
    const dirtyOrganizations = await this.dirtySet.list();

    if (dirtyOrganizations.length === 0) return;
    this.logger.log(
      `Reconciling ${dirtyOrganizations.length} dirty organizations.`,
    );

    for (const organizationId of dirtyOrganizations) {
      await this.reconcileOrganization(organizationId);
      await this.dirtySet.unmark(organizationId);
    }
  }

  /**
   * Reconciles all the initialized tenants.
   */
  private async reconcileAllTenants(): Promise<void> {
    const systemKnex = this.initSystemKnex();

    try {
      const tenants = await systemKnex('tenants')
        .whereNotNull('initializedAt')
        .select('organizationId as organizationId');

      for (const tenant of tenants) {
        await this.reconcileOrganization(tenant.organizationId);
      }
    } finally {
      await systemKnex.destroy();
    }
  }

  /**
   * Rebuilds the given organization data in ClickHouse.
   * @param {string} organizationId
   */
  private async reconcileOrganization(organizationId: string): Promise<void> {
    try {
      await this.syncService.rebuildOrganization(organizationId);
    } catch (error) {
      this.logger.warn(
        `Failed to reconcile org ${organizationId}: ${error.message}`,
      );
    }
  }

  /**
   * Builds a raw system database connection.
   * @returns {Knex}
   */
  private initSystemKnex(): Knex {
    return knex({
      client: this.configService.get('systemDatabase.client'),
      connection: {
        host: this.configService.get('systemDatabase.host'),
        port: this.configService.get('systemDatabase.port'),
        user: this.configService.get('systemDatabase.user'),
        password: this.configService.get('systemDatabase.password'),
        database: this.configService.get('systemDatabase.databaseName'),
        charset: 'utf8',
      },
      pool: { min: 0, max: 2 },
    });
  }
}
