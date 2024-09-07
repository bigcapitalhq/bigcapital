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
   * Deletes the cashflow transaction once uncategorize the bank transaction.
   * @param {ICashflowTransactionUncategorizedPayload} payload
   */
  public async deleteCashflowTransactionOnUncategorize({
    tenantId,
    oldMainUncategorizedTransaction,
    trx,
  }: ICashflowTransactionUncategorizedPayload) {
    // Cannot continue if the main transaction does not reference to cashflow type.
    if (
      oldMainUncategorizedTransaction.categorizeRefType !==
      'CashflowTransaction'
    ) {
      return;
    }
    await this.deleteCashflowTransactionService.deleteCashflowTransaction(
      tenantId,
      oldMainUncategorizedTransaction.categorizeRefId,
      trx
    );
  }
}
