import { ICashflowTransactionUncategorizedPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import { DeleteCashflowTransaction } from '../DeleteCashflowTransactionService';

@Service()
export class DeleteCashflowTransactionOnUncategorize {
  @Inject()
  private deleteCashflowTransactionService: DeleteCashflowTransaction;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(events.cashflow.onTransactionUncategorized, this.deleteCashflowTransactionOnUncategorize.bind(this));
  };

  /**
   * Deletes the cashflow transaction on uncategorize transaction.
   * @param {ICashflowTransactionUncategorizedPayload} payload
   */
  public async deleteCashflowTransactionOnUncategorize({
    tenantId,
    oldUncategorizedTransaction,
    trx,
  }: ICashflowTransactionUncategorizedPayload) {
    // Deletes the cashflow transaction.
    if (oldUncategorizedTransaction.categorizeRefType === 'CashflowTransaction') {
      await this.deleteCashflowTransactionService.deleteCashflowTransaction(
        tenantId,

        oldUncategorizedTransaction.categorizeRefId,
      );
    }
  }
}
