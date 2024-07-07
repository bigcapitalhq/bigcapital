import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import {
  IBankTransactionExcludedEventPayload,
  IBankTransactionUnexcludedEventPayload,
} from '../_types';

@Service()
export class DecrementUncategorizedTransactionOnExclude {
  @Inject()
  private tenancy: HasTenancyService;
  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.bankTransactions.onExcluded,
      this.decrementUnCategorizedTransactionsOnExclude.bind(this)
    );
    bus.subscribe(
      events.bankTransactions.onUnexcluded,
      this.incrementUnCategorizedTransactionsOnUnexclude.bind(this)
    );
  }

  /**
   * Validates the cashflow transaction whether matched with bank transaction on deleting.
   * @param {IManualJournalDeletingPayload}
   */
  public async decrementUnCategorizedTransactionsOnExclude({
    tenantId,
    uncategorizedTransactionId,
    trx,
  }: IBankTransactionExcludedEventPayload) {
    const { UncategorizedCashflowTransaction, Account } =
      this.tenancy.models(tenantId);

    const transaction = await UncategorizedCashflowTransaction.query(
      trx
    ).findById(uncategorizedTransactionId);

    await Account.query(trx)
      .findById(transaction.accountId)
      .decrement('uncategorizedTransactions', 1);
  }

  /**
   * Validates the cashflow transaction whether matched with bank transaction on deleting.
   * @param {IManualJournalDeletingPayload}
   */
  public async incrementUnCategorizedTransactionsOnUnexclude({
    tenantId,
    uncategorizedTransactionId,
    trx,
  }: IBankTransactionUnexcludedEventPayload) {
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
