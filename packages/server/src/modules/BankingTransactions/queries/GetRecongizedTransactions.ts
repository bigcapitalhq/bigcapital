import { Inject, Injectable } from '@nestjs/common';
import { GetRecognizedTransactionTransformer } from './GetRecognizedTransactionTransformer';
import { UncategorizedBankTransaction } from '../models/UncategorizedBankTransaction';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { IGetRecognizedTransactionsQuery } from '../types/BankingTransactions.types';

@Injectable()
export class GetRecognizedTransactionsService {
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransactionModel: typeof UncategorizedBankTransaction,
  ) {}

  /**
   * Retrieves the recognized transactions of the given account.
   * @param {number} tenantId
   * @param {IGetRecognizedTransactionsQuery} filter -
   */
  async getRecognizedTranactions(filter?: IGetRecognizedTransactionsQuery) {
    const _query = {
      page: 1,
      pageSize: 20,
      ...filter,
    };
    const { results, pagination } =
      await this.uncategorizedBankTransactionModel.query()
        .onBuild((q) => {
          q.withGraphFetched('recognizedTransaction.assignAccount');
          q.withGraphFetched('recognizedTransaction.bankRule');
          q.whereNotNull('recognizedTransactionId');

          // Exclude the excluded transactions.
          q.modify('notExcluded');

          // Exclude the pending transactions.
          q.modify('notPending');

          if (_query.accountId) {
            q.where('accountId', _query.accountId);
          }
          if (_query.minDate) {
            q.modify('fromDate', _query.minDate);
          }
          if (_query.maxDate) {
            q.modify('toDate', _query.maxDate);
          }
          if (_query.minAmount) {
            q.modify('minAmount', _query.minAmount);
          }
          if (_query.maxAmount) {
            q.modify('maxAmount', _query.maxAmount);
          }
          if (_query.accountId) {
            q.where('accountId', _query.accountId);
          }
        })
        .pagination(_query.page - 1, _query.pageSize);

    const data = await this.transformer.transform(
      results,
      new GetRecognizedTransactionTransformer(),
    );
    return { data, pagination };
  }
}
