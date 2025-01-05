import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { UncategorizedBankTransaction } from '@/modules/BankingTransactions/models/UncategorizedBankTransaction';
import {
  validateTransactionNotCategorized,
  validateTransactionNotExcluded,
} from './utils';
import {
  IBankTransactionUnexcludedEventPayload,
  IBankTransactionUnexcludingEventPayload,
} from '../types/BankTransactionsExclude.types';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';

@Injectable()
export class ExcludeBankTransactionService {
  constructor(
    @Inject(UncategorizedBankTransaction.name)
    private uncategorizedBankTransactionModel: typeof UncategorizedBankTransaction,

    private uow: UnitOfWork,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Marks the given bank transaction as excluded.
   * @param {number} uncategorizedTransactionId - Uncategorized bank transaction identifier.
   * @returns {Promise<void>}
   */
  public async excludeBankTransaction(uncategorizedTransactionId: number) {
    const oldUncategorizedTransaction =
      await this.uncategorizedBankTransactionModel
        .query()
        .findById(uncategorizedTransactionId)
        .throwIfNotFound();

    // Validate the transaction shouldn't be excluded.
    validateTransactionNotExcluded(oldUncategorizedTransaction);

    // Validate the transaction shouldn't be categorized.
    validateTransactionNotCategorized(oldUncategorizedTransaction);

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      await this.eventEmitter.emitAsync(events.bankTransactions.onExcluding, {
        uncategorizedTransactionId,
        trx,
      } as IBankTransactionUnexcludingEventPayload);

      await this.uncategorizedBankTransactionModel
        .query(trx)
        .findById(uncategorizedTransactionId)
        .patch({
          excludedAt: new Date(),
        });

      await this.eventEmitter.emitAsync(events.bankTransactions.onExcluded, {
        uncategorizedTransactionId,
        trx,
      } as IBankTransactionUnexcludedEventPayload);
    });
  }
}
