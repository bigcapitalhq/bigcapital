import { PromisePool } from '@supercharge/promise-pool';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import {
  IBankTransactionMatchedEventPayload,
  IBankTransactionMatchingEventPayload,
  IMatchTransactionDTO,
} from './types';

@Service()
export class MatchBankTransactions {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Matches the given uncategorized transaction to the given references.
   * @param {number} tenantId
   * @param {number} uncategorizedTransactionId
   */
  public matchTransaction(
    tenantId: number,
    uncategorizedTransactionId: number,
    matchTransactionsDTO: IMatchTransactionDTO
  ) {
    const { matchedTransactions } = matchTransactionsDTO;
    const { MatchBankTransaction } = this.tenancy.models(tenantId);

    //
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers the event `onSaleInvoiceCreated`.
      await this.eventPublisher.emitAsync(events.bankMatch.onMatching, {
        tenantId,
        uncategorizedTransactionId,
        matchTransactionsDTO,
        trx,
      } as IBankTransactionMatchingEventPayload);

      //  Matches the given transactions under promise pool concurrency controlling.
      await PromisePool.withConcurrency(10)
        .for(matchedTransactions)
        .process(async (matchedTransaction) => {
          await MatchBankTransaction.query(trx).insert({
            uncategorizedTransactionId,
            referenceType: matchedTransaction.referenceType,
            referenceId: matchedTransaction.referenceId,
            amount: matchedTransaction.amount,
          });
        });

      // Triggers the event `onSaleInvoiceCreated`.
      await this.eventPublisher.emitAsync(events.bankMatch.onMatched, {
        tenantId,
        uncategorizedTransactionId,
        matchTransactionsDTO,
        trx,
      } as IBankTransactionMatchedEventPayload);
    });
  }
}
