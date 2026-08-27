import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { events } from '@/common/events/events';
import { runAfterTransaction } from '@/modules/Tenancy/TenancyDB/TransactionsHooks';
import { IPlaidTransactionsSyncedEventPayload } from '../types/BankingPlaid.types';
import {
  RecognizeUncategorizedTransactionsJob,
  RecognizeUncategorizedTransactionsJobPayload,
  RecognizeUncategorizedTransactionsQueue,
} from '@/modules/BankingTranasctionsRegonize/_types';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export class RecognizeSyncedBankTranasctionsSubscriber {
  constructor(
    private readonly tenancyContext: TenancyContext,

    @InjectQueue(RecognizeUncategorizedTransactionsQueue)
    private readonly recognizeTransactionsQueue: Queue,
  ) {}

  /**
   * Triggers the recognize transactions job once the Plaid transactions synced
   * and the current transaction committed.
   * @param {IPlaidTransactionsSyncedEventPayload} payload - Event payload.
   */
  @OnEvent(events.plaid.onTransactionsSynced)
  public async handleRecognizeSyncedBankTransactions({
    batch,
    trx,
  }: IPlaidTransactionsSyncedEventPayload) {
    runAfterTransaction(trx, async () => {
      const tenantPayload = await this.tenancyContext.getTenantJobPayload();
      const payload = {
        transactionsCriteria: { batch },
        ...tenantPayload,
      } as RecognizeUncategorizedTransactionsJobPayload;

      await this.recognizeTransactionsQueue.add(
        RecognizeUncategorizedTransactionsJob,
        payload,
      );
    });
  }
}
