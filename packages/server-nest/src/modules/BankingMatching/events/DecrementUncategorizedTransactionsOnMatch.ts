import {
  IBankTransactionMatchedEventPayload,
  IBankTransactionUnmatchedEventPayload,
} from '../types';
import PromisePool from '@supercharge/promise-pool';
import { OnEvent } from '@nestjs/event-emitter';
import { Account } from '@/modules/Accounts/models/Account.model';
import { Inject, Injectable } from '@nestjs/common';
import { UncategorizedBankTransaction } from '@/modules/BankingTransactions/models/UncategorizedBankTransaction';
import { events } from '@/common/events/events';

@Injectable()
export class DecrementUncategorizedTransactionOnMatchingSubscriber {
  constructor(
    @Inject(Account.name)
    private readonly accountModel: typeof Account,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransactionModel: typeof UncategorizedBankTransaction,
  ) {}

  /**
   * Validates the cashflow transaction whether matched with bank transaction on deleting.
   * @param {IManualJournalDeletingPayload}
   */
  @OnEvent(events.bankMatch.onMatched)
  public async decrementUnCategorizedTransactionsOnMatching({
    uncategorizedTransactionIds,
    trx,
  }: IBankTransactionMatchedEventPayload) {
    const uncategorizedTransactions =
      await this.uncategorizedBankTransactionModel.query().whereIn(
        'id',
        uncategorizedTransactionIds
      );
    await PromisePool.withConcurrency(1)
      .for(uncategorizedTransactions)
      .process(async (transaction) => {
        await this.accountModel
          .query(trx)
          .findById(transaction.accountId)
          .decrement('uncategorizedTransactions', 1);
      });
  }

  /**
   * Validates the cashflow transaction whether matched with bank transaction on deleting.
   * @param {IManualJournalDeletingPayload}
   */
  @OnEvent(events.bankMatch.onUnmatched)
  public async incrementUnCategorizedTransactionsOnUnmatching({
    uncategorizedTransactionId,
    trx,
  }: IBankTransactionUnmatchedEventPayload) {
    const transaction =
      await this.uncategorizedBankTransactionModel.query().findById(
        uncategorizedTransactionId
      );
    await this.accountModel
      .query(trx)
      .findById(transaction.accountId)
      .increment('uncategorizedTransactions', 1);
  }
}
