import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import { Inject, Service } from 'typedi';
import { validateTransactionNotCategorized } from './utils';
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

    validateTransactionNotCategorized(oldUncategorizedTransaction);

    return this.uow.withTransaction(tenantId, async (trx) => {
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
