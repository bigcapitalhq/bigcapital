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
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import type { RecognizedBankTransaction } from '@/modules/BankingTranasctionsRegonize/models/RecognizedBankTransaction';

@Injectable()
export class RemovePendingUncategorizedTransaction {
  constructor(
    private readonly eventPublisher: EventEmitter2,
    private readonly uow: UnitOfWork,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransaction: TenantModelProxy<
      typeof UncategorizedBankTransaction
    >,
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
    const pendingTransaction = await this.uncategorizedBankTransaction()
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
      // Unlink and remove the recognized transaction (if any) before deleting
      // the pending transaction, since both tables reference each other.
      await this.removeRecognizedTransaction(
        uncategorizedTransactionId,
        pendingTransaction,
        trx,
      );
      // Removes the pending uncategorized transaction.
      await this.uncategorizedBankTransaction()
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
    }, trx);
  }

  /**
   * Removes the recognized bank transaction linked to the given pending
   * transaction.
   * @param {number} uncategorizedTransactionId - Pending transaction id.
   * @param {UncategorizedBankTransaction} pendingTransaction - Pending transaction.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<void>}
   */
  private async removeRecognizedTransaction(
    uncategorizedTransactionId: number,
    pendingTransaction: UncategorizedBankTransaction,
    trx: Knex.Transaction,
  ): Promise<void> {
    if (!pendingTransaction.recognizedTransactionId) {
      return;
    }
    // Break the circular reference before deleting the recognized row.
    await this.uncategorizedBankTransaction()
      .query(trx)
      .findById(uncategorizedTransactionId)
      .patch({ recognizedTransactionId: null });

    await pendingTransaction
      .$relatedQuery<RecognizedBankTransaction>('recognizedTransaction', trx)
      .delete();
  }
}
