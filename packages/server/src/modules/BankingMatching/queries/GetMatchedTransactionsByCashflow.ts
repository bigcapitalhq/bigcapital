import { GetMatchedTransactionsByType } from './GetMatchedTransactionsByType';
import { GetMatchedTransactionCashflowTransformer } from './GetMatchedTransactionCashflowTransformer';
import { GetMatchedTransactionsByTypeFilter } from '../types';
import { BankTransaction } from '@/modules/BankingTransactions/models/BankTransaction';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetMatchedTransactionsByCashflow extends GetMatchedTransactionsByType {
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(BankTransaction.name)
    private readonly bankTransactionModel: TenantModelProxy<
      typeof BankTransaction
    >,
  ) {
    super();
  }

  /**
   * Retrieve the matched transactions of cash flow.
   * @param {number} tenantId
   * @param {GetMatchedTransactionsByTypeFilter} filter
   * @returns
   */
  async getMatchedTransactions(
    filter: Omit<GetMatchedTransactionsByTypeFilter, 'transactionType'>,
  ) {
    const transactions = await this.bankTransactionModel()
      .query()
      .onBuild((q) => {
        // Not matched to bank transaction.
        q.whereNotExists(this.matchedAsCashflowTransactionQuery());

        // Not categorized.
        q.modify('notCategorized');

        // Published.
        q.modify('published');

        // Only transactions recorded on the bank transactions' accounts.
        q.whereIn('cashflowAccountId', filter.accountIds);

        if (filter.fromDate) {
          q.where('date', '>=', filter.fromDate);
        }
        if (filter.toDate) {
          q.where('date', '<=', filter.toDate);
        }
        q.orderBy('date', 'DESC');
      });

    return this.transformer.transform(
      transactions,
      new GetMatchedTransactionCashflowTransformer(),
    );
  }

  /**
   * Retrieves the matched transaction of cash flow.
   * @param {number} tenantId
   * @param {number} transactionId
   * @returns
   */
  async getMatchedTransaction(transactionId: number) {
    const transactions = await this.bankTransactionModel()
      .query()
      .findById(transactionId)
      .whereNotExists(this.matchedAsCashflowTransactionQuery())
      .modify('notCategorized')
      .modify('published')
      .throwIfNotFound();

    return this.transformer.transform(
      transactions,
      new GetMatchedTransactionCashflowTransformer(),
    );
  }

  /**
   * Subquery of the bank matches of the outer cash flow transaction.
   * Matches are stored with the `CashflowTransaction` reference type, which
   * the `BankTransaction.matchedBankTransaction` relation doesn't filter by.
   */
  private matchedAsCashflowTransactionQuery() {
    return this.matchedBankTransactionModel()
      .query()
      .where('referenceType', 'CashflowTransaction')
      .whereColumn('referenceId', 'cashflowTransactions.id');
  }
}
