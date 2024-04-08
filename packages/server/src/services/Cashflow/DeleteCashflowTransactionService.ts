import { ServiceError } from '@/exceptions';
import {
  ICashflowTransaction,
  ICommandCashflowDeletedPayload,
  ICommandCashflowDeletingPayload,
} from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { ERRORS } from './constants';

@Service()
export class DeleteCashflowTransaction {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Deletes the cashflow transaction with associated journal entries.
   * @param {number} tenantId -
   * @param {number} userId - User id.
   */
  public deleteCashflowTransaction = async (
    tenantId: number,
    cashflowTransactionId: number,
  ): Promise<{ oldCashflowTransaction: ICashflowTransaction }> => {
    const { CashflowTransaction, CashflowTransactionLine } = this.tenancy.models(tenantId);

    // Retrieve the cashflow transaction.
    const oldCashflowTransaction = await CashflowTransaction.query().findById(cashflowTransactionId);
    // Throw not found error if the given transaction id not found.
    this.throwErrorIfTransactionNotFound(oldCashflowTransaction);

    // Starting database transaction.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onCashflowTransactionDelete` event.
      await this.eventPublisher.emitAsync(events.cashflow.onTransactionDeleting, {
        trx,
        tenantId,
        oldCashflowTransaction,
      } as ICommandCashflowDeletingPayload);

      // Delete cashflow transaction associated lines first.
      await CashflowTransactionLine.query(trx).where('cashflow_transaction_id', cashflowTransactionId).delete();

      // Delete cashflow transaction.
      await CashflowTransaction.query(trx).findById(cashflowTransactionId).delete();

      // Triggers `onCashflowTransactionDeleted` event.
      await this.eventPublisher.emitAsync(events.cashflow.onTransactionDeleted, {
        trx,
        tenantId,
        cashflowTransactionId,
        oldCashflowTransaction,
      } as ICommandCashflowDeletedPayload);

      return { oldCashflowTransaction };
    });
  };

  /**
   * Throw not found error if the given transaction id not found.
   * @param transaction
   */
  private throwErrorIfTransactionNotFound(transaction) {
    if (!transaction) {
      throw new ServiceError(ERRORS.CASHFLOW_TRANSACTION_NOT_FOUND);
    }
  }
}
