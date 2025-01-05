import { Knex } from 'knex';
import { ERRORS } from '../constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { BankTransaction } from '../models/BankTransaction';
import { BankTransactionLine } from '../models/BankTransactionLine';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { events } from '@/common/events/events';
import {
  ICommandCashflowDeletedPayload,
  ICommandCashflowDeletingPayload,
} from '../types/BankingTransactions.types';

@Injectable()
export class DeleteCashflowTransaction {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventEmitter: EventEmitter2,

    @Inject(BankTransaction.name)
    private readonly bankTransaction: typeof BankTransaction,

    @Inject(BankTransactionLine.name)
    private readonly bankTransactionLine: typeof BankTransactionLine,
  ) {}

  /**
   * Deletes the cashflow transaction with associated journal entries.
   * @param {number} tenantId -
   * @param {number} userId - User id.
   */
  public deleteCashflowTransaction = async (
    cashflowTransactionId: number,
    trx?: Knex.Transaction,
  ): Promise<BankTransaction> => {
    // Retrieve the cashflow transaction.
    const oldCashflowTransaction = await this.bankTransaction
      .query()
      .findById(cashflowTransactionId);
    // Throw not found error if the given transaction id not found.
    this.throwErrorIfTransactionNotFound(oldCashflowTransaction);

    // Starting database transaction.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onCashflowTransactionDelete` event.
      await this.eventEmitter.emitAsync(events.cashflow.onTransactionDeleting, {
        trx,
        oldCashflowTransaction,
      } as ICommandCashflowDeletingPayload);

      // Delete cashflow transaction associated lines first.
      await this.bankTransactionLine
        .query(trx)
        .where('cashflow_transaction_id', cashflowTransactionId)
        .delete();

      // Delete cashflow transaction.
      await this.bankTransaction
        .query(trx)
        .findById(cashflowTransactionId)
        .delete();

      // Triggers `onCashflowTransactionDeleted` event.
      await this.eventEmitter.emitAsync(events.cashflow.onTransactionDeleted, {
        trx,
        cashflowTransactionId,
        oldCashflowTransaction,
      } as ICommandCashflowDeletedPayload);

      return oldCashflowTransaction;
    }, trx);
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
