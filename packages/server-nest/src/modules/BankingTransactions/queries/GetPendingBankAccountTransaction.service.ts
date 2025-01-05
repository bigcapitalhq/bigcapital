import { Inject, Injectable } from '@nestjs/common';
import { GetPendingBankAccountTransactionTransformer } from './GetPendingBankAccountTransactionTransformer';
import { UncategorizedBankTransaction } from '../models/UncategorizedBankTransaction';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';

@Injectable()
export class GetPendingBankAccountTransactions {
  constructor(
    private readonly transformerService: TransformerInjectable,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransactionModel: typeof UncategorizedBankTransaction
  ) {}

  /**
   * Retrieves the given bank accounts pending transaction.
   * @param {GetPendingTransactionsQuery} filter - Pending transactions query.
   */
  async getPendingTransactions(filter?: GetPendingTransactionsQuery) {
    const _filter = {
      page: 1, 
      pageSize: 20,
      ...filter,
    };
    const { results, pagination } =
      await this.uncategorizedBankTransactionModel.query()
        .onBuild((q) => {
          q.modify('pending');

        if (_filter?.accountId) {
          q.where('accountId', _filter.accountId);
        }
      })
      .pagination(_filter.page - 1, _filter.pageSize);

    const data = await this.transformerService.transform(
      results,
      new GetPendingBankAccountTransactionTransformer()
    );
    return { data, pagination };
  }
}

interface GetPendingTransactionsQuery {
  page?: number;
  pageSize?: number;
  accountId?: number;
}
