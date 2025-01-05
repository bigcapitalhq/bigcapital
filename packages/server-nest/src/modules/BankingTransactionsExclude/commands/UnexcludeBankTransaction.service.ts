import { Knex } from 'knex';
import {
  validateTransactionNotCategorized,
  validateTransactionShouldBeExcluded,
} from './utils';
import {
  IBankTransactionExcludedEventPayload,
  IBankTransactionExcludingEventPayload,
} from '../types/BankTransactionsExclude.types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { UncategorizedBankTransaction } from '@/modules/BankingTransactions/models/UncategorizedBankTransaction';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';

@Injectable()
export class UnexcludeBankTransactionService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransactionModel: typeof UncategorizedBankTransaction,
  ) {}

  /**
   * Marks the given bank transaction as excluded.
   * @param {number} tenantId
   * @param {number} bankTransactionId
   * @returns {Promise<void>}
   */
  public async unexcludeBankTransaction(
    uncategorizedTransactionId: number,
  ): Promise<void> {
    const oldUncategorizedTransaction =
      await this.uncategorizedBankTransactionModel
        .query()
        .findById(uncategorizedTransactionId)
        .throwIfNotFound();

    // Validate the transaction should be excludded.
    validateTransactionShouldBeExcluded(oldUncategorizedTransaction);

    // Validate the transaction shouldn't be categorized.
    validateTransactionNotCategorized(oldUncategorizedTransaction);

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      await this.eventEmitter.emitAsync(events.bankTransactions.onUnexcluding, {
        uncategorizedTransactionId,
      } as IBankTransactionExcludingEventPayload);

      await this.uncategorizedBankTransactionModel
        .query(trx)
        .findById(uncategorizedTransactionId)
        .patch({
          excludedAt: null,
        });

      await this.eventEmitter.emitAsync(events.bankTransactions.onUnexcluded, {
        uncategorizedTransactionId,
      } as IBankTransactionExcludedEventPayload);
    });
  }
}
