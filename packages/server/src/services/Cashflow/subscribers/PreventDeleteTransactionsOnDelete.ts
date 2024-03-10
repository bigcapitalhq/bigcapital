import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { ICommandCashflowDeletingPayload } from '@/interfaces';
import { ServiceError } from '@/exceptions';
import { ERRORS } from '../constants';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class PreventDeleteTransactionOnDelete {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.cashflow.onTransactionDeleting,
      this.preventDeleteCashflowTransactionHasUncategorizedTransaction.bind(
        this
      )
    );
  };

  /**
   * Prevent delete cashflow transaction has converted from uncategorized transaction.
   * @param {ICommandCashflowDeletingPayload} payload
   */
  public async preventDeleteCashflowTransactionHasUncategorizedTransaction({
    tenantId,
    oldCashflowTransaction,
    trx,
  }: ICommandCashflowDeletingPayload) {
    const { UncategorizedCashflowTransaction } = this.tenancy.models(tenantId);
    if (oldCashflowTransaction.uncategorizedTransactionId) {
      const foundTransactions = await UncategorizedCashflowTransaction.query(
        trx
      ).where({
        categorized: true,
        categorizeRefId: oldCashflowTransaction.id,
        categorizeRefType: 'CashflowTransaction',
      });
      // Throw the error if the cashflow transaction still linked to uncategorized transaction.
      if (foundTransactions.length > 0) {
        throw new ServiceError(
          ERRORS.CANNOT_DELETE_TRANSACTION_CONVERTED_FROM_UNCATEGORIZED,
          'Cannot delete cashflow transaction converted from uncategorized transaction.'
        );
      }
    }
  }
}
