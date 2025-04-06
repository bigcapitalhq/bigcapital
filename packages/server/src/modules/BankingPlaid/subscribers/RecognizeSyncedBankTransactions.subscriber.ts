import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { RecognizeTranasctionsService } from '@/modules/BankingTranasctionsRegonize/commands/RecognizeTranasctions.service';
import { runAfterTransaction } from '@/modules/Tenancy/TenancyDB/TransactionsHooks';
import { IPlaidTransactionsSyncedEventPayload } from '../types/BankingPlaid.types';

@Injectable()
export class RecognizeSyncedBankTranasctionsSubscriber  {
  constructor(
    private readonly recognizeTranasctionsService: RecognizeTranasctionsService,
  ) {}

  /**
   * Updates the Plaid item transactions
   * @param {IPlaidItemCreatedEventPayload} payload - Event payload.
   */
  @OnEvent(events.plaid.onTransactionsSynced)
  public async handleRecognizeSyncedBankTransactions({
    batch,
    trx,
  }: IPlaidTransactionsSyncedEventPayload) {
    runAfterTransaction(trx, async () => {
      await this.recognizeTranasctionsService.recognizeTransactions(
        null,
        { batch }
      );
    });
  };
}
