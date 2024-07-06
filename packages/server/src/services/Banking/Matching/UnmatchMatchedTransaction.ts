import { Inject, Service } from 'typedi';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { IBankTransactionUnmatchingEventPayload } from './types';

@Service()
export class UnmatchMatchedBankTransaction {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Unmatch the matched the given uncategorized bank transaction.
   * @param {number} tenantId
   * @param {number} uncategorizedTransactionId
   * @returns {Promise<void>}
   */
  public unmatchMatchedTransaction(
    tenantId: number,
    uncategorizedTransactionId: number
  ): Promise<void> {
    const { MatchedBankTransaction } = this.tenancy.models(tenantId);

    return this.uow.withTransaction(tenantId, async (trx) => {
      await this.eventPublisher.emitAsync(events.bankMatch.onUnmatching, {
        tenantId,
        uncategorizedTransactionId,
        trx,
      } as IBankTransactionUnmatchingEventPayload);

      await MatchedBankTransaction.query(trx)
        .where('uncategorizedTransactionId', uncategorizedTransactionId)
        .delete();

      await this.eventPublisher.emitAsync(events.bankMatch.onUnmatched, {
        tenantId,
        uncategorizedTransactionId,
        trx,
      } as IBankTransactionUnmatchingEventPayload);
    });
  }
}
