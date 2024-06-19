import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import { IBankTransactionUnmatchingEventPayload } from './types';

@Service()
export class UnmatchMatchedBankTransaction {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  public unmatchMatchedTransaction(
    tenantId: number,
    uncategorizedTransactionId: number
  ) {
    const { MatchedBankTransaction } = this.tenancy.models(tenantId);

    return this.uow.withTransaction(tenantId, async (trx) => {
      await this.eventPublisher.emitAsync(events.bankMatch.onUnmatching, {
        tenantId,
        trx,
      } as IBankTransactionUnmatchingEventPayload);

      await MatchedBankTransaction.query(trx)
        .where('uncategorizedTransactionId', uncategorizedTransactionId)
        .delete();

      await this.eventPublisher.emitAsync(events.bankMatch.onUnmatched, {
        tenantId,
        trx,
      } as IBankTransactionUnmatchingEventPayload);
    });
  }
}
