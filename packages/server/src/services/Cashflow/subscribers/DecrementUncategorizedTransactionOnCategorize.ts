import { Inject, Service } from 'typedi';
import PromisePool from '@supercharge/promise-pool';
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
    bus.subscribe(
      events.cashflow.onTransactionUncategorizedCreated,
      this.incrementUncategoirzedTransactionsOnCreated.bind(this)
    );
  }

  /**
   * Decrement the uncategoirzed transactions on the account once categorizing.
   * @param {ICashflowTransactionCategorizedPayload}
   */
  public async decrementUnCategorizedTransactionsOnCategorized({
    tenantId,
    uncategorizedTransactions,
    trx,
  }: ICashflowTransactionCategorizedPayload) {
    const { Account } = this.tenancy.models(tenantId);

    await PromisePool.withConcurrency(1)
      .for(uncategorizedTransactions)
      .process(async (uncategorizedTransaction) => {
        // Cannot continue if the transaction is still pending.
        if (uncategorizedTransaction.isPending) {
          return;
        }
        await Account.query(trx)
          .findById(uncategorizedTransaction.accountId)
          .decrement('uncategorizedTransactions', 1);
      });
  }

  /**
   * Increment the uncategorized transaction on the given account on uncategorizing.
   * @param {IManualJournalDeletingPayload}
   */
  public async incrementUnCategorizedTransactionsOnUncategorized({
    tenantId,
    uncategorizedTransactions,
    trx,
  }: ICashflowTransactionUncategorizedPayload) {
    const { Account } = this.tenancy.models(tenantId);

    await PromisePool.withConcurrency(1)
      .for(uncategorizedTransactions)
      .process(async (uncategorizedTransaction) => {
        // Cannot continue if the transaction is still pending.
        if (uncategorizedTransaction.isPending) {
          return;
        }
        await Account.query(trx)
          .findById(uncategorizedTransaction.accountId)
          .increment('uncategorizedTransactions', 1);
      });
  }

  /**
   * Increments uncategorized transactions count once creating a new transaction.
   * @param {ICommandCashflowCreatedPayload} payload -
   */
  public async incrementUncategoirzedTransactionsOnCreated({
    tenantId,
    uncategorizedTransaction,
    trx,
  }: any) {
    const { Account } = this.tenancy.models(tenantId);

    if (!uncategorizedTransaction.accountId) return;

    // Cannot continue if the transaction is still pending.
    if (uncategorizedTransaction.isPending) return;

    await Account.query(trx)
      .findById(uncategorizedTransaction.accountId)
      .increment('uncategorizedTransactions', 1);
  }
}
