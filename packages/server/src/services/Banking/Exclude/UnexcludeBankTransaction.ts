import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import {
  validateTransactionNotCategorized,
  validateTransactionShouldBeExcluded,
} from './utils';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import {
  IBankTransactionExcludedEventPayload,
  IBankTransactionExcludingEventPayload,
} from './_types';

@Service()
export class UnexcludeBankTransaction {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Marks the given bank transaction as excluded.
   * @param {number} tenantId
   * @param {number} bankTransactionId
   * @returns {Promise<void>}
   */
  public async unexcludeBankTransaction(
    tenantId: number,
    uncategorizedTransactionId: number
  ): Promise<void> {
    const { UncategorizedCashflowTransaction } = this.tenancy.models(tenantId);

    const oldUncategorizedTransaction =
      await UncategorizedCashflowTransaction.query()
        .findById(uncategorizedTransactionId)
        .throwIfNotFound();

    // Validate the transaction should be excludded.
    validateTransactionShouldBeExcluded(oldUncategorizedTransaction);

    // Validate the transaction shouldn't be categorized.
    validateTransactionNotCategorized(oldUncategorizedTransaction);

    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      await this.eventPublisher.emitAsync(
        events.bankTransactions.onUnexcluding,
        {
          tenantId,
          uncategorizedTransactionId,
        } as IBankTransactionExcludingEventPayload
      );

      await UncategorizedCashflowTransaction.query(trx)
        .findById(uncategorizedTransactionId)
        .patch({
          excludedAt: null,
        });

      await this.eventPublisher.emitAsync(
        events.bankTransactions.onUnexcluded,
        {
          tenantId,
          uncategorizedTransactionId,
        } as IBankTransactionExcludedEventPayload
      );
    });
  }
}
