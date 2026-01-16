import { OnEvent } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import {
  IBankTransactionExcludedEventPayload,
  IBankTransactionUnexcludedEventPayload,
} from '../types/BankTransactionsExclude.types';
import { Account } from '@/modules/Accounts/models/Account.model';
import { UncategorizedBankTransaction } from '@/modules/BankingTransactions/models/UncategorizedBankTransaction';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class DecrementUncategorizedTransactionOnExclude {
  constructor(
    @Inject(Account.name)
    private readonly account: TenantModelProxy<typeof Account>,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransaction: TenantModelProxy<
      typeof UncategorizedBankTransaction
    >,
  ) { }

  /**
   * Validates the cashflow transaction whether matched with bank transaction on deleting.
   * @param {IManualJournalDeletingPayload}
   */
  @OnEvent(events.bankTransactions.onExcluded)
  public async decrementUnCategorizedTransactionsOnExclude({
    uncategorizedTransactionId,
    trx,
  }: IBankTransactionExcludedEventPayload) {
    const transaction = await this.uncategorizedBankTransaction()
      .query(trx)
      .findById(uncategorizedTransactionId);

    await this.account()
      .query(trx)
      .findById(transaction.accountId)
      .decrement('uncategorizedTransactions', 1);
  }

  /**
   * Validates the cashflow transaction whether matched with bank transaction on deleting.
   * @param {IManualJournalDeletingPayload}
   */
  @OnEvent(events.bankTransactions.onUnexcluded)
  public async incrementUnCategorizedTransactionsOnUnexclude({
    uncategorizedTransactionId,
    trx,
  }: IBankTransactionUnexcludedEventPayload) {
    const transaction = await this.uncategorizedBankTransaction()
      .query(trx)
      .findById(uncategorizedTransactionId);
    //
    await this.account()
      .query(trx)
      .findById(transaction.accountId)
      .increment('uncategorizedTransactions', 1);
  }
}
