import { Service } from 'typedi';
import events from '@/subscribers/events';
import { ICommandCashflowDeletingPayload } from '@/interfaces';
import { ServiceError } from '@/exceptions';
import { ERRORS } from '../constants';

@Service()
export class PreventDeleteTransactionOnDelete {
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
    if (oldCashflowTransaction.uncategorizedTransactionId) {
      throw new ServiceError(
        ERRORS.CANNOT_DELETE_TRANSACTION_CONVERTED_FROM_UNCATEGORIZED,
        'Cannot delete cashflow transaction converted from uncategorized transaction.'
      );
    }
  }
}
