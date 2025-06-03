import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { UncategorizedBankTransaction } from '../models/UncategorizedBankTransaction';
import { UncategorizedTransactionTransformer } from '../../BankingCategorize/commands/UncategorizedTransaction.transformer';
import { GetUncategorizedTransactionsQueryDto } from '../dtos/GetUncategorizedTransactionsQuery.dto';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetUncategorizedTransactions {
  /**
   * @param {TransformerInjectable} transformer 
   * @param {UncategorizedBankTransaction.name} uncategorizedBankTransactionModel 
   */
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransactionModel: TenantModelProxy<
      typeof UncategorizedBankTransaction
    >,
  ) {}

  /**
   * Retrieves the uncategorized cashflow transactions.
   * @param {number} accountId - Account Id.
   * @param {IGetUncategorizedTransactionsQuery} query - Query.
   */
  public async getTransactions(
    accountId: number,
    query: GetUncategorizedTransactionsQueryDto,
  ) {
    // Parsed query with default values.
    const _query = {
      page: 1,
      pageSize: 20,
      ...query,
    };
    const { results, pagination } =
      await this.uncategorizedBankTransactionModel()
        .query()
        .onBuild((q) => {
          q.where('accountId', accountId);
          q.where('categorized', false);

          q.modify('notExcluded');
          q.modify('notPending');

          q.withGraphFetched('account');
          q.withGraphFetched('recognizedTransaction.assignAccount');

          q.withGraphJoined('matchedBankTransactions');

          q.whereNull('matchedBankTransactions.id');
          q.orderBy('date', 'DESC');

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
        })
        .pagination(_query.page - 1, _query.pageSize);

    const data = await this.transformer.transform(
      results,
      new UncategorizedTransactionTransformer(),
    );
    return {
      data,
      pagination,
    };
  }
}
