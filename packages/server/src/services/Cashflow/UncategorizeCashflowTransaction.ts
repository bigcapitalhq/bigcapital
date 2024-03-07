import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import UnitOfWork from '../UnitOfWork';
import events from '@/subscribers/events';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import {
  ICashflowTransactionUncategorizedPayload,
  ICashflowTransactionUncategorizingPayload,
} from '@/interfaces';

@Service()
export class UncategorizeCashflowTransaction {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Uncategorizes the given cashflow transaction.
   * @param {number} tenantId
   * @param {number} cashflowTransactionId
   */
  public async uncategorize(
    tenantId: number,
    uncategorizedTransactionId: number
  ) {
    const { UncategorizedCashflowTransaction } = this.tenancy.models(tenantId);

    const oldUncategorizedTransaction =
      await UncategorizedCashflowTransaction.query()
        .findById(uncategorizedTransactionId)
        .throwIfNotFound();

    // Updates the transaction under UOW.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onTransactionUncategorizing` event.
      await this.eventPublisher.emitAsync(
        events.cashflow.onTransactionUncategorizing,
        {
          tenantId,
          trx,
        } as ICashflowTransactionUncategorizingPayload
      );
      // Removes the ref relation with the related transaction.
      const uncategorizedTransaction =
        await UncategorizedCashflowTransaction.query(trx).updateAndFetchById(
          uncategorizedTransactionId,
          {
            categorized: false,
            categorizeRefId: null,
            categorizeRefType: null,
          }
        );
      // Triggers `onTransactionUncategorized` event.
      await this.eventPublisher.emitAsync(
        events.cashflow.onTransactionUncategorized,
        {
          tenantId,
          uncategorizedTransaction,
          oldUncategorizedTransaction,
          trx,
        } as ICashflowTransactionUncategorizedPayload
      );
      return uncategorizedTransaction;
    });
  }
}
