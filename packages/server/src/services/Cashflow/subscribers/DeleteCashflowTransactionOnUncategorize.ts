import { Inject, Service } from 'typedi';
import { PromisePool } from '@supercharge/promise-pool';
import events from '@/subscribers/events';
import { ICashflowTransactionUncategorizedPayload } from '@/interfaces';
import { DeleteCashflowTransaction } from '../DeleteCashflowTransactionService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ServiceError } from '@/exceptions';

@Service()
export class DeleteCashflowTransactionOnUncategorize {
  @Inject()
  private deleteCashflowTransactionService: DeleteCashflowTransaction;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.cashflow.onTransactionUncategorized,
      this.deleteCashflowTransactionOnUncategorize.bind(this)
    );
  };

  /**
   * Deletes the cashflow transaction on uncategorize transaction.
   * @param {ICashflowTransactionUncategorizedPayload} payload
   */
  public async deleteCashflowTransactionOnUncategorize({
    tenantId,
    oldUncategorizedTransactions,
    trx,
  }: ICashflowTransactionUncategorizedPayload) {
    const _oldUncategorizedTransactions = oldUncategorizedTransactions.filter(
      (transaction) => transaction.categorizeRefType === 'CashflowTransaction'
    );

    // Deletes the cashflow transaction.
    if (_oldUncategorizedTransactions.length > 0) {
      const result = await PromisePool.withConcurrency(1)
        .for(_oldUncategorizedTransactions)
        .process(async (oldUncategorizedTransaction) => {
          await this.deleteCashflowTransactionService.deleteCashflowTransaction(
            tenantId,
            oldUncategorizedTransaction.categorizeRefId,
            trx
          );
        });
      if (result.errors.length > 0) {
        throw new ServiceError('SOMETHING_WRONG');
      }
    }
  }
}
