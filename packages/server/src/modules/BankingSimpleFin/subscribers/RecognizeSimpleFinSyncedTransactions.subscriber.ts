import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { events } from '@/common/events/events';
import { runAfterTransaction } from '@/modules/Tenancy/TenancyDB/TransactionsHooks';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import {
  RecognizeUncategorizedTransactionsJob,
  RecognizeUncategorizedTransactionsJobPayload,
  RecognizeUncategorizedTransactionsQueue,
} from '@/modules/BankingTranasctionsRegonize/_types';
import { ISimpleFinTransactionsSyncedEventPayload } from '../types/BankingSimpleFin.types';

@Injectable()
export class RecognizeSimpleFinSyncedTransactionsSubscriber {
  constructor(
    private readonly tenancyContext: TenancyContext,

    @InjectQueue(RecognizeUncategorizedTransactionsQueue)
    private readonly recognizeTransactionsQueue: Queue,
  ) {}

  /**
   * Runs the bank rules recognition over the synced batch once the sync
   * transaction commits.
   * @param {ISimpleFinTransactionsSyncedEventPayload} payload
   */
  @OnEvent(events.simplefin.onTransactionsSynced)
  public async handleRecognizeSyncedTransactions({
    batch,
    trx,
  }: ISimpleFinTransactionsSyncedEventPayload) {
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
