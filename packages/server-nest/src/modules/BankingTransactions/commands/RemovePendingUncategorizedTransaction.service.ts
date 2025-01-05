import { Knex } from 'knex';
import { ERRORS } from '../constants';
import {
  IPendingTransactionRemovedEventPayload,
  IPendingTransactionRemovingEventPayload,
} from '../types/BankingTransactions.types';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UncategorizedBankTransaction } from '../models/UncategorizedBankTransaction';
import { ServiceError } from '@/modules/Items/ServiceError';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';

@Injectable()
export class RemovePendingUncategorizedTransaction {
  constructor(
    private readonly eventPublisher: EventEmitter2,
    private readonly uow: UnitOfWork,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransaction: typeof UncategorizedBankTransaction,
  ) {}

  /**
   * REmoves the pending uncategorized transaction.
   * @param {number} uncategorizedTransactionId -
   * @param {Knex.Transaction} trx -
   * @returns {Promise<void>}
   */
  public async removePendingTransaction(
    uncategorizedTransactionId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    const pendingTransaction = await this.uncategorizedBankTransaction
      .query(trx)
      .findById(uncategorizedTransactionId)
      .throwIfNotFound();

    if (!pendingTransaction.isPending) {
      throw new ServiceError(ERRORS.TRANSACTION_NOT_PENDING);
    }
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      await this.eventPublisher.emitAsync(
        events.bankTransactions.onPendingRemoving,
        {
          uncategorizedTransactionId,
          pendingTransaction,
          trx,
        } as IPendingTransactionRemovingEventPayload,
      );
      // Removes the pending uncategorized transaction.
      await this.uncategorizedBankTransaction
        .query(trx)
        .findById(uncategorizedTransactionId)
        .delete();

      await this.eventPublisher.emitAsync(
        events.bankTransactions.onPendingRemoved,
        {
          uncategorizedTransactionId,
          pendingTransaction,
          trx,
        } as IPendingTransactionRemovedEventPayload,
      );
    });
  }
}
