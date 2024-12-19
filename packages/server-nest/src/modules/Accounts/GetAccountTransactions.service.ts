import {
  IAccountsTransactionsFilter,
  IGetAccountTransactionPOJO,
} from './Accounts.types';
import { AccountTransactionTransformer } from './AccountTransaction.transformer';
import { AccountTransaction } from './models/AccountTransaction.model';
import { Account } from './models/Account.model';
import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';

@Injectable()
export class GetAccountTransactionsService {
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(AccountTransaction.name)
    private readonly accountTransaction: typeof AccountTransaction,

    @Inject(Account.name)
    private readonly account: typeof Account,
  ) {}

  /**
   * Retrieve the accounts transactions.
   * @param {IAccountsTransactionsFilter} filter -
   */
  public getAccountsTransactions = async (
    filter: IAccountsTransactionsFilter,
  ): Promise<IGetAccountTransactionPOJO[]> => {
    // Retrieve the given account or throw not found error.
    if (filter.accountId) {
      await this.account.query().findById(filter.accountId).throwIfNotFound();
    }
    const transactions = await this.accountTransaction
      .query()
      .onBuild((query) => {
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
      transactions,
      new AccountTransactionTransformer(),
    );
  };
}
