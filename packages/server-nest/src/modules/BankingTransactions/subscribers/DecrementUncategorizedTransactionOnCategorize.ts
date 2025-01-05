import PromisePool from '@supercharge/promise-pool';
import {
  ICashflowTransactionCategorizedPayload,
  ICashflowTransactionUncategorizedPayload,
} from '../types/BankingTransactions.types';
import { OnEvent } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import { Account } from '@/modules/Accounts/models/Account.model';
import { UncategorizedBankTransaction } from '../models/UncategorizedBankTransaction';

@Injectable()
export class DecrementUncategorizedTransactionOnCategorizeSubscriber {
  constructor(
    @Inject(Account.name)
    private readonly accountModel: typeof Account,
  ) {}

  /**
   * Decrement the uncategoirzed transactions on the account once categorizing.
   * @param {ICashflowTransactionCategorizedPayload}
   */
  @OnEvent(events.cashflow.onTransactionCategorized)
  public async decrementUnCategorizedTransactionsOnCategorized({
    uncategorizedTransactions,
    trx,
  }: ICashflowTransactionCategorizedPayload) {
    await PromisePool.withConcurrency(1)
      .for(uncategorizedTransactions)
      .process(
        async (uncategorizedTransaction: UncategorizedBankTransaction) => {
          // Cannot continue if the transaction is still pending.
          if (uncategorizedTransaction.isPending) {
            return;
          }
          await this.accountModel
            .query(trx)
            .findById(uncategorizedTransaction.accountId)
            .decrement('uncategorizedTransactions', 1);
        },
      );
  }

  /**
   * Increment the uncategorized transaction on the given account on uncategorizing.
   * @param {IManualJournalDeletingPayload}
   */
  @OnEvent(events.cashflow.onTransactionUncategorized)
  public async incrementUnCategorizedTransactionsOnUncategorized({
    uncategorizedTransactions,
    trx,
  }: ICashflowTransactionUncategorizedPayload) {
    await PromisePool.withConcurrency(1)
      .for(uncategorizedTransactions)
      .process(
        async (uncategorizedTransaction: UncategorizedBankTransaction) => {
          // Cannot continue if the transaction is still pending.
          if (uncategorizedTransaction.isPending) {
            return;
          }
          await this.accountModel
            .query(trx)
            .findById(uncategorizedTransaction.accountId)
            .increment('uncategorizedTransactions', 1);
        },
      );
  }

  /**
   * Increments uncategorized transactions count once creating a new transaction.
   * @param {ICommandCashflowCreatedPayload} payload -
   */
  @OnEvent(events.cashflow.onTransactionUncategorizedCreated)
  public async incrementUncategoirzedTransactionsOnCreated({
    uncategorizedTransaction,
    trx,
  }: any) {
    if (!uncategorizedTransaction.accountId) return;

    // Cannot continue if the transaction is still pending.
    if (uncategorizedTransaction.isPending) return;

    await this.accountModel
      .query(trx)
      .findById(uncategorizedTransaction.accountId)
      .increment('uncategorizedTransactions', 1);
  }
}
