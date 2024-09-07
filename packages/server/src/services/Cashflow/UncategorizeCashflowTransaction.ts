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
import { validateTransactionShouldBeCategorized } from './utils';

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
   * @returns {Promise<Array<number>>}
   */
  public async uncategorize(
    tenantId: number,
    uncategorizedTransactionId: number
  ): Promise<Array<number>> {
    const { UncategorizedCashflowTransaction } = this.tenancy.models(tenantId);

    const oldMainUncategorizedTransaction =
      await UncategorizedCashflowTransaction.query()
        .findById(uncategorizedTransactionId)
        .throwIfNotFound();

    validateTransactionShouldBeCategorized(oldMainUncategorizedTransaction);

    const associatedUncategorizedTransactions =
      await UncategorizedCashflowTransaction.query()
        .where('categorizeRefId', oldMainUncategorizedTransaction.categorizeRefId)
        .where(
          'categorizeRefType',
          oldMainUncategorizedTransaction.categorizeRefType
        )
        // Exclude the main transaction.
        .whereNot('id', uncategorizedTransactionId);

    const oldUncategorizedTransactions = [
      oldMainUncategorizedTransaction,
      ...associatedUncategorizedTransactions,
    ];
    const oldUncategoirzedTransactionsIds = oldUncategorizedTransactions.map(
      (t) => t.id
    );
    // Updates the transaction under UOW.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onTransactionUncategorizing` event.
      await this.eventPublisher.emitAsync(
        events.cashflow.onTransactionUncategorizing,
        {
          tenantId,
          uncategorizedTransactionId,
          oldUncategorizedTransactions,
          trx,
        } as ICashflowTransactionUncategorizingPayload
      );
      // Removes the ref relation with the related transaction.
      await UncategorizedCashflowTransaction.query(trx)
        .whereIn('id', oldUncategoirzedTransactionsIds)
        .patch({
          categorized: false,
          categorizeRefId: null,
          categorizeRefType: null,
        });
      const uncategorizedTransactions =
        await UncategorizedCashflowTransaction.query(trx).whereIn(
          'id',
          oldUncategoirzedTransactionsIds
        );
      // Triggers `onTransactionUncategorized` event.
      await this.eventPublisher.emitAsync(
        events.cashflow.onTransactionUncategorized,
        {
          tenantId,
          uncategorizedTransactionId,
          oldMainUncategorizedTransaction,
          uncategorizedTransactions,
          oldUncategorizedTransactions,
          trx,
        } as ICashflowTransactionUncategorizedPayload
      );
      return oldUncategoirzedTransactionsIds;
    });
  }
}
