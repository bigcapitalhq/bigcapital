import { Service, Inject } from 'typedi';
import {
  IAccountsTransactionsFilter,
  IAccountTransaction,
  IGetAccountTransactionPOJO,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import AccountTransactionTransformer from './AccountTransactionTransformer';

@Service()
export class GetAccountTransactions {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the accounts transactions.
   * @param {number} tenantId -
   * @param {IAccountsTransactionsFilter} filter -
   */
  public getAccountsTransactions = async (
    tenantId: number,
    filter: IAccountsTransactionsFilter
  ): Promise<IGetAccountTransactionPOJO[]> => {
    const { AccountTransaction, Account } = this.tenancy.models(tenantId);

    // Retrieve the given account or throw not found error.
    if (filter.accountId) {
      await Account.query().findById(filter.accountId).throwIfNotFound();
    }
    const transactions = await AccountTransaction.query().onBuild((query) => {
      query.orderBy('date', 'DESC');

      if (filter.accountId) {
        query.where('account_id', filter.accountId);
      }
      query.withGraphFetched('account');
      query.withGraphFetched('contact');
      query.limit(filter.limit || 50);
    });
    // Transform the account transaction.
    return this.transformer.transform(
      tenantId,
      transactions,
      new AccountTransactionTransformer()
    );
  };
}
