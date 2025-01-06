import { Inject, Injectable } from '@nestjs/common';
import { IBankTransactionUnmatchingEventPayload } from '../types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '../../Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { MatchedBankTransaction } from '../models/MatchedBankTransaction';

@Injectable()
export class UnmatchMatchedBankTransaction {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,

    @Inject(MatchedBankTransaction.name)
    private readonly matchedBankTransactionModel: typeof MatchedBankTransaction,
  ) {}

  /**
   * Unmatch the matched the given uncategorized bank transaction.
   * @param {number} uncategorizedTransactionId - Uncategorized transaction id.
   * @returns {Promise<void>}
   */
  public unmatchMatchedTransaction(
    uncategorizedTransactionId: number,
  ): Promise<void> {
    return this.uow.withTransaction(async (trx) => {
      await this.eventPublisher.emitAsync(events.bankMatch.onUnmatching, {
        uncategorizedTransactionId,
        trx,
      } as IBankTransactionUnmatchingEventPayload);

      await this.matchedBankTransactionModel
        .query(trx)
        .where('uncategorizedTransactionId', uncategorizedTransactionId)
        .delete();

      await this.eventPublisher.emitAsync(events.bankMatch.onUnmatched, {
        uncategorizedTransactionId,
        trx,
      } as IBankTransactionUnmatchingEventPayload);
    });
  }
}
