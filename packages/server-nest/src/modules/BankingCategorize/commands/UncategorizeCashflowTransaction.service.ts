import { Knex } from 'knex';
import {
  ICashflowTransactionUncategorizedPayload,
  ICashflowTransactionUncategorizingPayload,
} from '../types/BankingCategorize.types';
import { validateTransactionShouldBeCategorized } from '../../BankingTransactions/utils';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { UncategorizedBankTransaction } from '../../BankingTransactions/models/UncategorizedBankTransaction';

@Injectable()
export class UncategorizeCashflowTransactionService {
  constructor(
    private readonly eventPublisher: EventEmitter2,
    private readonly uow: UnitOfWork,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransactionModel: typeof UncategorizedBankTransaction,
  ) {}

  /**
   * Uncategorizes the given cashflow transaction.
   * @param {number} cashflowTransactionId - The id of the cashflow transaction to be uncategorized.
   * @returns {Promise<Array<number>>}
   */
  public async uncategorize(
    uncategorizedTransactionId: number,
  ): Promise<Array<number>> {
    const oldMainUncategorizedTransaction =
      await this.uncategorizedBankTransactionModel
        .query()
        .findById(uncategorizedTransactionId)
        .throwIfNotFound();

    validateTransactionShouldBeCategorized(oldMainUncategorizedTransaction);

    const associatedUncategorizedTransactions =
      await this.uncategorizedBankTransactionModel
        .query()
        .where(
          'categorizeRefId',
          oldMainUncategorizedTransaction.categorizeRefId,
        )
        .where(
          'categorizeRefType',
          oldMainUncategorizedTransaction.categorizeRefType,
        )
        // Exclude the main transaction.
        .whereNot('id', uncategorizedTransactionId);

    const oldUncategorizedTransactions = [
      oldMainUncategorizedTransaction,
      ...associatedUncategorizedTransactions,
    ];
    const oldUncategoirzedTransactionsIds = oldUncategorizedTransactions.map(
      (t) => t.id,
    );
    // Updates the transaction under UOW.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onTransactionUncategorizing` event.
      await this.eventPublisher.emitAsync(
        events.cashflow.onTransactionUncategorizing,
        {
          uncategorizedTransactionId,
          oldUncategorizedTransactions,
          trx,
        } as ICashflowTransactionUncategorizingPayload,
      );
      // Removes the ref relation with the related transaction.
      await this.uncategorizedBankTransactionModel
        .query(trx)
        .whereIn('id', oldUncategoirzedTransactionsIds)
        .patch({
          categorized: false,
          categorizeRefId: null,
          categorizeRefType: null,
        });
      const uncategorizedTransactions =
        await this.uncategorizedBankTransactionModel
          .query(trx)
          .whereIn('id', oldUncategoirzedTransactionsIds);
      // Triggers `onTransactionUncategorized` event.
      await this.eventPublisher.emitAsync(
        events.cashflow.onTransactionUncategorized,
        {
          uncategorizedTransactionId,
          oldMainUncategorizedTransaction,
          uncategorizedTransactions,
          oldUncategorizedTransactions,
          trx,
        } as ICashflowTransactionUncategorizedPayload,
      );
      return oldUncategoirzedTransactionsIds;
    });
  }
}
