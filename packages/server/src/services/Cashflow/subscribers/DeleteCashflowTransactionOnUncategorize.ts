import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { ICashflowTransactionUncategorizedPayload } from '@/interfaces';
import { DeleteCashflowTransaction } from '../DeleteCashflowTransactionService';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class DeleteCashflowTransactionOnUncategorize {
  @Inject()
  private deleteCashflowTransactionService: DeleteCashflowTransaction;

  @Inject()
  private tenancy: HasTenancyService;

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
    oldUncategorizedTransaction,
    trx,
  }: ICashflowTransactionUncategorizedPayload) {
    const { CashflowTransaction } = this.tenancy.models(tenantId);

    // Deletes the cashflow transaction.
    if (
      oldUncategorizedTransaction.categorizeRefType === 'CashflowTransaction'
    ) {
      await CashflowTransaction.query()
        .findById(oldUncategorizedTransaction.categorizeRefId)
        .patch({
          uncategorizedTransactionId: null,
        });

      await this.deleteCashflowTransactionService.deleteCashflowTransaction(
        tenantId,
        oldUncategorizedTransaction.categorizeRefId
      );
    }
  }
}
