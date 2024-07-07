import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import { Inject, Service } from 'typedi';
import { validateTransactionNotCategorized } from './utils';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import {
  IBankTransactionUnexcludedEventPayload,
  IBankTransactionUnexcludingEventPayload,
} from './_types';

@Service()
export class ExcludeBankTransaction {
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
  public async excludeBankTransaction(
    tenantId: number,
    uncategorizedTransactionId: number
  ) {
    const { UncategorizedCashflowTransaction } = this.tenancy.models(tenantId);

    const oldUncategorizedTransaction =
      await UncategorizedCashflowTransaction.query()
        .findById(uncategorizedTransactionId)
        .throwIfNotFound();

    validateTransactionNotCategorized(oldUncategorizedTransaction);

    return this.uow.withTransaction(tenantId, async (trx) => {
      await this.eventPublisher.emitAsync(events.bankTransactions.onExcluding, {
        tenantId,
        uncategorizedTransactionId,
        trx,
      } as IBankTransactionUnexcludingEventPayload);

      await UncategorizedCashflowTransaction.query(trx)
        .findById(uncategorizedTransactionId)
        .patch({
          excludedAt: new Date(),
        });

      await this.eventPublisher.emitAsync(events.bankTransactions.onExcluded, {
        tenantId,
        uncategorizedTransactionId,
        trx,
      } as IBankTransactionUnexcludedEventPayload);
    });
  }
}
