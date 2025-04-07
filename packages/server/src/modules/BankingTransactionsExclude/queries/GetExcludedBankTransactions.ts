import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { ExcludedBankTransactionsQuery } from '../types/BankTransactionsExclude.types';
import { UncategorizedTransactionTransformer } from '@/modules/BankingCategorize/commands/UncategorizedTransaction.transformer';
import { UncategorizedBankTransaction } from '@/modules/BankingTransactions/models/UncategorizedBankTransaction';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetExcludedBankTransactionsService {
  /**
   * @param {TransformerInjectable} transformer
   * @param {TenantModelProxy<typeof UncategorizedBankTransaction>} uncategorizedBankTransaction
   */
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransaction: TenantModelProxy<
      typeof UncategorizedBankTransaction
    >,
  ) {}

  /**
   * Retrieves the excluded uncategorized bank transactions.
   * @param {ExcludedBankTransactionsQuery} filter
   * @returns
   */
  public async getExcludedBankTransactions(
    filter: ExcludedBankTransactionsQuery,
  ) {
    // Parsed query with default values.
    const _query = {
      page: 1,
      pageSize: 20,
      ...filter,
    };
    const { results, pagination } = await this.uncategorizedBankTransaction()
      .query()
      .onBuild((q) => {
        q.modify('excluded');
        q.orderBy('date', 'DESC');

        if (_query.accountId) {
          q.where('account_id', _query.accountId);
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
      })
      .pagination(_query.page - 1, _query.pageSize);

    const data = await this.transformer.transform(
      results,
      new UncategorizedTransactionTransformer(),
    );
    return { data, pagination };
  }
}
