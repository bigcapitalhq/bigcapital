import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import {
  IPlaidItemCreatedEventPayload,
  IPlaidTransactionsSyncedEventPayload,
} from '@/interfaces/Plaid';
import events from '@/subscribers/events';
import { RecognizeTranasctionsService } from '../../RegonizeTranasctions/RecognizeTranasctionsService';
import { runAfterTransaction } from '@/services/UnitOfWork/TransactionsHooks';

@Service()
export class RecognizeSyncedBankTranasctions extends EventSubscriber {
  @Inject()
  private recognizeTranasctionsService: RecognizeTranasctionsService;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.plaid.onTransactionsSynced,
      this.handleRecognizeSyncedBankTransactions.bind(this)
    );
  }

  /**
   * Updates the Plaid item transactions
   * @param {IPlaidItemCreatedEventPayload} payload - Event payload.
   */
  private handleRecognizeSyncedBankTransactions = async ({
    tenantId,
    batch,
    trx,
  }: IPlaidTransactionsSyncedEventPayload) => {
    runAfterTransaction(trx, async () => {
      await this.recognizeTranasctionsService.recognizeTransactions(
        tenantId,
        null,
        { batch }
      );
    });
  };
}
