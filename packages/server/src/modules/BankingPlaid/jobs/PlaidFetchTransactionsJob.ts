import { Process } from '@nestjs/bull';
import { UseCls } from 'nestjs-cls';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Scope } from '@nestjs/common';
import { Job } from 'bullmq';
import {
  PlaidFetchTransitonsEventPayload,
  UpdateBankingPlaidTransitionsJob,
  UpdateBankingPlaidTransitionsQueueJob,
} from '../types/BankingPlaid.types';
import { PlaidUpdateTransactions } from '../command/PlaidUpdateTransactions';
import { SetupPlaidItemTenantService } from '../command/SetupPlaidItemTenant.service';

@Processor({
  name: UpdateBankingPlaidTransitionsQueueJob,
  scope: Scope.REQUEST,
})
export class PlaidFetchTransactionsProcessor extends WorkerHost {
  constructor(
    private readonly plaidFetchTransactionsService: PlaidUpdateTransactions,
    private readonly setupPlaidItemService: SetupPlaidItemTenantService,
  ) {
    super();
  }

  /**
   * Triggers the function.
   */
  @Process(UpdateBankingPlaidTransitionsJob)
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
      // io.emit('NEW_TRANSACTIONS_DATA', { plaidItemId });
    } catch (error) {
      console.log(error);
    }
  }
}
