import { Inject, Service } from 'typedi';
import { initialize } from 'objection';
import { GetMatchedTransactionsFilter, MatchedTransactionPOJO } from './types';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { GetMatchedTransactionsByType } from './GetMatchedTransactionsByType';
import { GetMatchedTransactionExpensesTransformer } from './GetMatchedTransactionExpensesTransformer';

@Service()
export class GetMatchedTransactionsByExpenses extends GetMatchedTransactionsByType {
  @Inject()
  protected tenancy: HasTenancyService;

  @Inject()
  protected transformer: TransformerInjectable;

  /**
   * Retrieves the matched transactions of expenses.
   * @param {number} tenantId
   * @param {GetMatchedTransactionsFilter} filter
   * @returns
   */
  async getMatchedTransactions(
    tenantId: number,
    filter: GetMatchedTransactionsFilter
  ) {
    const { Expense, MatchedBankTransaction } = this.tenancy.models(tenantId);
    const knex = this.tenancy.knex(tenantId);

    // Initialize the models metadata.
    await initialize(knex, [Expense, MatchedBankTransaction]);

    // Retrieve the expense matches.
    const expenses = await Expense.query().onBuild((query) => {
      // Filter out the not matched to bank transactions.
      query.withGraphJoined('matchedBankTransaction');
      query.whereNull('matchedBankTransaction.id');

      // Filter the published onyl
      query.modify('filterByPublished');

      if (filter.fromDate) {
        query.where('paymentDate', '>=', filter.fromDate);
      }
      if (filter.toDate) {
        query.where('paymentDate', '<=', filter.toDate);
      }
      if (filter.minAmount) {
        query.where('totalAmount', '>=', filter.minAmount);
      }
      if (filter.maxAmount) {
        query.where('totalAmount', '<=', filter.maxAmount);
      }
      query.orderBy('paymentDate', 'DESC');
    });
    return this.transformer.transform(
      tenantId,
      expenses,
      new GetMatchedTransactionExpensesTransformer()
    );
  }

  /**
   * Retrieves the given matched expense transaction.
   * @param {number} tenantId
   * @param {number} transactionId
   * @returns {GetMatchedTransactionExpensesTransformer-}
   */
  public async getMatchedTransaction(
    tenantId: number,
    transactionId: number
  ): Promise<MatchedTransactionPOJO> {
    const { Expense } = this.tenancy.models(tenantId);

    const expense = await Expense.query()
      .findById(transactionId)
      .throwIfNotFound();

    return this.transformer.transform(
      tenantId,
      expense,
      new GetMatchedTransactionExpensesTransformer()
    );
  }
}
