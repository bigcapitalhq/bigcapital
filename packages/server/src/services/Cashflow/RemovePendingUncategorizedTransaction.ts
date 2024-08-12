import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import UnitOfWork from '../UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import { ServiceError } from '@/exceptions';
import { ERRORS } from './constants';
import {
  IPendingTransactionRemovedEventPayload,
  IPendingTransactionRemovingEventPayload,
} from '@/interfaces';

@Service()
export class RemovePendingUncategorizedTransaction {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * REmoves the pending uncategorized transaction.
   * @param {number} tenantId -
   * @param {number} uncategorizedTransactionId -
   * @param {Knex.Transaction} trx -
   * @returns {Promise<void>}
   */
  public async removePendingTransaction(
    tenantId: number,
    uncategorizedTransactionId: number,
    trx?: Knex.Transaction
  ): Promise<void> {
    const { UncategorizedCashflowTransaction } = this.tenancy.models(tenantId);

    const pendingTransaction = await UncategorizedCashflowTransaction.query(trx)
      .findById(uncategorizedTransactionId)
      .throwIfNotFound();

    if (!pendingTransaction.isPending) {
      throw new ServiceError(ERRORS.TRANSACTION_NOT_PENDING);
    }
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      await this.eventPublisher.emitAsync(
        events.bankTransactions.onPendingRemoving,
        {
          tenantId,
          uncategorizedTransactionId,
          pendingTransaction,
          trx,
        } as IPendingTransactionRemovingEventPayload
      );
      // Removes the pending uncategorized transaction.
      await UncategorizedCashflowTransaction.query(trx)
        .findById(uncategorizedTransactionId)
        .delete();

      await this.eventPublisher.emitAsync(
        events.bankTransactions.onPendingRemoved,
        {
          tenantId,
          uncategorizedTransactionId,
          pendingTransaction,
          trx,
        } as IPendingTransactionRemovedEventPayload
      );
    });
  }
}
