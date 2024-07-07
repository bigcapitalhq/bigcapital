import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  IBankTransactionMatchedEventPayload,
  IBankTransactionUnmatchedEventPayload,
} from '../types';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class DecrementUncategorizedTransactionOnMatching {
  @Inject()
  private tenancy: HasTenancyService;
  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.bankMatch.onMatched,
      this.decrementUnCategorizedTransactionsOnMatching.bind(this)
    );
    bus.subscribe(
      events.bankMatch.onUnmatched,
      this.incrementUnCategorizedTransactionsOnUnmatching.bind(this)
    );
  }

  /**
   * Validates the cashflow transaction whether matched with bank transaction on deleting.
   * @param {IManualJournalDeletingPayload}
   */
  public async decrementUnCategorizedTransactionsOnMatching({
    tenantId,
    uncategorizedTransactionId,
    trx,
  }: IBankTransactionMatchedEventPayload) {
    const { UncategorizedCashflowTransaction, Account } =
      this.tenancy.models(tenantId);

    const transaction = await UncategorizedCashflowTransaction.query().findById(
      uncategorizedTransactionId
    );
    //
    await Account.query(trx)
      .findById(transaction.accountId)
      .decrement('uncategorizedTransactions', 1);
  }

  /**
   * Validates the cashflow transaction whether matched with bank transaction on deleting.
   * @param {IManualJournalDeletingPayload}
   */
  public async incrementUnCategorizedTransactionsOnUnmatching({
    tenantId,
    uncategorizedTransactionId,
    trx,
  }: IBankTransactionUnmatchedEventPayload) {
    const { UncategorizedCashflowTransaction, Account } =
      this.tenancy.models(tenantId);

    const transaction = await UncategorizedCashflowTransaction.query().findById(
      uncategorizedTransactionId
    );
    //
    await Account.query(trx)
      .findById(transaction.accountId)
      .increment('uncategorizedTransactions', 1);
  }
}
