import { GetMatchedTransactionsByType } from './GetMatchedTransactionsByType';
import { GetMatchedTransactionCashflowTransformer } from './GetMatchedTransactionCashflowTransformer';
import { GetMatchedTransactionsFilter } from '../types';
import { BankTransaction } from '@/modules/BankingTransactions/models/BankTransaction';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetMatchedTransactionsByCashflow extends GetMatchedTransactionsByType {
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(BankTransaction.name)
    private readonly bankTransactionModel: typeof BankTransaction,
  ) {
    super();
  }

  /**
   * Retrieve the matched transactions of cash flow.
   * @param {number} tenantId
   * @param {GetMatchedTransactionsFilter} filter
   * @returns
   */
  async getMatchedTransactions(
    filter: Omit<GetMatchedTransactionsFilter, 'transactionType'>,
  ) {
    const transactions = await this.bankTransactionModel
      .query()
      .onBuild((q) => {
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
    const transactions = await this.bankTransactionModel
      .query()
      .findById(transactionId)
      .withGraphJoined('matchedBankTransaction')
      .whereNull('matchedBankTransaction.id')
      .modify('notCategorized')
      .modify('published')
      .throwIfNotFound();

    return this.transformer.transform(
      transactions,
      new GetMatchedTransactionCashflowTransformer(),
    );
  }
}
