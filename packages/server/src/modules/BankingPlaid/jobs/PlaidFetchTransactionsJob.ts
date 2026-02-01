import { UseCls } from 'nestjs-cls';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Scope } from '@nestjs/common';
import { Job } from 'bullmq';
import {
  PlaidFetchTransitonsEventPayload,
  UpdateBankingPlaidTransitionsQueueJob,
} from '../types/BankingPlaid.types';
import { PlaidUpdateTransactions } from '../command/PlaidUpdateTransactions';
import { SetupPlaidItemTenantService } from '../command/SetupPlaidItemTenant.service';
import { SocketGateway } from '../../Socket/Socket.gateway';

@Processor({
  name: UpdateBankingPlaidTransitionsQueueJob,
  scope: Scope.REQUEST,
})
export class PlaidFetchTransactionsProcessor extends WorkerHost {
  constructor(
    private readonly plaidFetchTransactionsService: PlaidUpdateTransactions,
    private readonly setupPlaidItemService: SetupPlaidItemTenantService,
    private readonly socketGateway: SocketGateway,
  ) {
    super();
  }

  /**
   * Triggers the function.
   */
  @UseCls()
  async process(job: Job<PlaidFetchTransitonsEventPayload>) {
    const { plaidItemId } = job.data;

    try {
      await this.setupPlaidItemService.setupPlaidTenant(plaidItemId, () => {
        return this.plaidFetchTransactionsService.updateTransactions(
          plaidItemId,
        );
      });
      // Notify the frontend to reflect the new transactions changes.
      this.socketGateway.emitNewTransactionsData();
    } catch (error) {
      console.log(error);
    }
  }
}
