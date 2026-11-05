import { UseCls } from 'nestjs-cls';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger, Scope } from '@nestjs/common';
import { Job } from 'bullmq';
import { SocketGateway } from '@/modules/Socket/Socket.gateway';
import {
  SimpleFinSyncJobPayload,
  SimpleFinSyncQueue,
} from '../types/BankingSimpleFin.types';
import { SimpleFinSyncTransactionsService } from '../commands/SimpleFinSyncTransactions.service';
import { SetupSimpleFinItemTenantService } from '../commands/SetupSimpleFinItemTenant.service';

@Processor({
  name: SimpleFinSyncQueue,
  scope: Scope.REQUEST,
})
export class SimpleFinSyncProcessor extends WorkerHost {
  private readonly logger = new Logger(SimpleFinSyncProcessor.name);

  constructor(
    private readonly syncTransactionsService: SimpleFinSyncTransactionsService,
    private readonly setupTenantService: SetupSimpleFinItemTenantService,
    private readonly socketGateway: SocketGateway,
  ) {
    super();
  }

  /**
   * Syncs the SimpleFIN item of the job under its tenant context.
   */
  @UseCls()
  async process(job: Job<SimpleFinSyncJobPayload>) {
    const { simplefinItemId, force } = job.data;

    try {
      const result = await this.setupTenantService.setupSimpleFinTenant(
        simplefinItemId,
        () => this.syncTransactionsService.syncItem(simplefinItemId, force),
      );
      if (!result.skipped) {
        this.logger.log(
          `SimpleFIN item ${simplefinItemId} synced, ${result.addedCount} new transactions.`,
        );
        // Notify the frontend to reflect the new transactions changes.
        this.socketGateway.emitNewTransactionsData();
      }
    } catch (error) {
      this.logger.error(
        `SimpleFIN item ${simplefinItemId} sync failed: ${error?.message}`,
        error?.stack,
      );
    }
  }
}
