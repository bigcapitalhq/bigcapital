import { Inject, Injectable } from '@nestjs/common';
import { initialize } from 'objection';
import { Knex } from 'knex';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { UncategorizedBankTransaction } from '../models/UncategorizedBankTransaction';
import { UncategorizedTransactionTransformer } from '../../BankingCategorize/commands/UncategorizedTransaction.transformer';
import { GetUncategorizedTransactionsQueryDto } from '../dtos/GetUncategorizedTransactionsQuery.dto';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TENANCY_DB_CONNECTION } from '@/modules/Tenancy/TenancyDB/TenancyDB.constants';
import { Account } from '@/modules/Accounts/models/Account.model';
import { RecognizedBankTransaction } from '@/modules/BankingTranasctionsRegonize/models/RecognizedBankTransaction';
import { MatchedBankTransaction } from '@/modules/BankingMatching/models/MatchedBankTransaction';

@Injectable()
export class GetUncategorizedTransactions {
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantDb: () => Knex,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransactionModel: TenantModelProxy<typeof UncategorizedBankTransaction>,

    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,

    @Inject(RecognizedBankTransaction.name)
    private readonly recognizedTransactionModel: TenantModelProxy<typeof RecognizedBankTransaction>,

    @Inject(MatchedBankTransaction.name)  
    private readonly matchedTransactionModel: TenantModelProxy<typeof MatchedBankTransaction>,
  ) {}

  /**
   * Retrieves the uncategorized cashflow transactions.
   * @param {number} accountId - Account Id.
   * @param {IGetUncategorizedTransactionsQuery} query - Query.
   */
  public async getTransactions(
    accountId: number,
    query: GetUncategorizedTransactionsQueryDto
  ) {
    // Parsed query with default values.
    const _query = {
      page: 1,
      pageSize: 20,
      ...query,
    };

    await initialize(this.tenantDb(), [
      this.accountModel(),
      this.uncategorizedBankTransactionModel(),
      this.recognizedTransactionModel(),
      this.matchedTransactionModel(),
    ]);

    const { results, pagination } =
      await this.uncategorizedBankTransactionModel().query()
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
      new UncategorizedTransactionTransformer()
    );
    return {
      data,
      pagination,
    };
  }
}
