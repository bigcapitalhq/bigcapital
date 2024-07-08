import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import {
  ICashflowTransactionCategorizedPayload,
  ICashflowTransactionUncategorizedPayload,
} from '@/interfaces';

@Service()
export class DecrementUncategorizedTransactionOnCategorize {
  @Inject()
  private tenancy: HasTenancyService;
  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.cashflow.onTransactionCategorized,
      this.decrementUnCategorizedTransactionsOnCategorized.bind(this)
    );
    bus.subscribe(
      events.cashflow.onTransactionUncategorized,
      this.incrementUnCategorizedTransactionsOnUncategorized.bind(this)
    );
  }

  /**
   * Decrement the uncategoirzed transactions on the account once categorizing.
   * @param {ICashflowTransactionCategorizedPayload}
   */
  public async decrementUnCategorizedTransactionsOnCategorized({
    tenantId,
    uncategorizedTransaction,
  }: ICashflowTransactionCategorizedPayload) {
    const { Account } = this.tenancy.models(tenantId);

    await Account.query()
      .findById(uncategorizedTransaction.accountId)
      .decrement('uncategorizedTransactions', 1);
  }

  /**
   * Increment the uncategorized transaction on the given account on uncategorizing.
   * @param {IManualJournalDeletingPayload}
   */
  public async incrementUnCategorizedTransactionsOnUncategorized({
    tenantId,
    uncategorizedTransaction,
  }: ICashflowTransactionUncategorizedPayload) {
    const { Account } = this.tenancy.models(tenantId);

    await Account.query()
      .findById(uncategorizedTransaction.accountId)
      .increment('uncategorizedTransactions', 1);
  }
}
