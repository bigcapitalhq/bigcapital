import { Inject, Service } from 'typedi';
import { initialize } from 'objection';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { GetMatchedTransactionsByType } from './GetMatchedTransactionsByType';
import { GetMatchedTransactionCashflowTransformer } from './GetMatchedTransactionCashflowTransformer';
import { GetMatchedTransactionsFilter } from './types';

@Service()
export class GetMatchedTransactionsByCashflow extends GetMatchedTransactionsByType {
  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the matched transactions of cash flow.
   * @param {number} tenantId
   * @param {GetMatchedTransactionsFilter} filter
   * @returns
   */
  async getMatchedTransactions(
    tenantId: number,
    filter: Omit<GetMatchedTransactionsFilter, 'transactionType'>
  ) {
    const { CashflowTransaction, MatchedBankTransaction } =
      this.tenancy.models(tenantId);
    const knex = this.tenancy.knex(tenantId);

    // Initialize the ORM models metadata.
    await initialize(knex, [CashflowTransaction, MatchedBankTransaction]);

    const transactions = await CashflowTransaction.query().onBuild((q) => {
      // Not matched to bank transaction.
      q.withGraphJoined('matchedBankTransaction');
      q.whereNull('matchedBankTransaction.id');

      // Not categorized.
      q.modify('notCategorized');

      // Published.
      q.modify('published');

      if (filter.fromDate) {
        q.where('date', '>=', filter.fromDate);
      }
      if (filter.toDate) {
        q.where('date', '<=', filter.toDate);
      }
      q.orderBy('date', 'DESC');
    });

    return this.transformer.transform(
      tenantId,
      transactions,
      new GetMatchedTransactionCashflowTransformer()
    );
  }

  /**
   * Retrieves the matched transaction of cash flow.
   * @param {number} tenantId
   * @param {number} transactionId
   * @returns
   */
  async getMatchedTransaction(tenantId: number, transactionId: number) {
    const { CashflowTransaction, MatchedBankTransaction } =
      this.tenancy.models(tenantId);
    const knex = this.tenancy.knex(tenantId);

    // Initialize the ORM models metadata.
    await initialize(knex, [CashflowTransaction, MatchedBankTransaction]);

    const transactions = await CashflowTransaction.query()
      .findById(transactionId)
      .withGraphJoined('matchedBankTransaction')
      .whereNull('matchedBankTransaction.id')
      .modify('notCategorized')
      .modify('published')
      .throwIfNotFound();

    return this.transformer.transform(
      tenantId,
      transactions,
      new GetMatchedTransactionCashflowTransformer()
    );
  }
}
