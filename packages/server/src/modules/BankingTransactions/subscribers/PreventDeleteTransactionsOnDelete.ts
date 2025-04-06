import { events } from '@/common/events/events';
import { ERRORS } from '../constants';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceError } from '@/modules/Items/ServiceError';
import { Inject, Injectable } from '@nestjs/common';
import { UncategorizedBankTransaction } from '../models/UncategorizedBankTransaction';
import { ICommandCashflowDeletingPayload } from '../types/BankingTransactions.types';

@Injectable()
export class PreventDeleteTransactionOnDeleteSubscriber {
  constructor(
    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransactionModel: typeof UncategorizedBankTransaction,
  ) {}

  /**
   * Prevent delete cashflow transaction has converted from uncategorized transaction.
   * @param {ICommandCashflowDeletingPayload} payload
   */
  @OnEvent(events.cashflow.onTransactionDeleting)
  public async preventDeleteCashflowTransactionHasUncategorizedTransaction({
    oldCashflowTransaction,
    trx,
  }: ICommandCashflowDeletingPayload) {
    if (oldCashflowTransaction.uncategorizedTransactionId) {
      const foundTransactions = await this.uncategorizedBankTransactionModel
        .query(trx)
        .where({
          categorized: true,
          categorizeRefId: oldCashflowTransaction.id,
          categorizeRefType: 'CashflowTransaction',
        });
      // Throw the error if the cashflow transaction still linked to uncategorized transaction.
      if (foundTransactions.length > 0) {
        throw new ServiceError(
          ERRORS.CANNOT_DELETE_TRANSACTION_CONVERTED_FROM_UNCATEGORIZED,
          'Cannot delete cashflow transaction converted from uncategorized transaction.',
        );
      }
    }
  }
}
