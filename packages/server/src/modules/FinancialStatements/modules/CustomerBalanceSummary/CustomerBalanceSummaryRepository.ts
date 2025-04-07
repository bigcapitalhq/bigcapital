import { map, isEmpty } from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import { Account } from '@/modules/Accounts/models/Account.model';
import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { Customer } from '@/modules/Customers/models/Customer';
import { ModelObject } from 'objection';
import { ACCOUNT_TYPE } from '@/constants/accounts';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class CustomerBalanceSummaryRepository {
  constructor(
    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,

    @Inject(AccountTransaction.name)
    private readonly accountTransactionModel: TenantModelProxy<
      typeof AccountTransaction
    >,

    @Inject(Customer.name)
    private readonly customerModel: TenantModelProxy<typeof Customer>,
  ) {}

  /**
   * Retrieve the report customers.
   * @param {number[]} customersIds
   * @returns {ICustomer[]}
   */
  public async getCustomers(
    customersIds: number[],
  ): Promise<ModelObject<Customer>[]> {
    return await this.customerModel()
      .query()
      .orderBy('displayName')
      .onBuild((query) => {
        if (!isEmpty(customersIds)) {
          query.whereIn('id', customersIds);
        }
      });
  }

  /**
   * Retrieve the A/R accounts.
   * @returns {Promise<IAccount[]>}
   */
  public async getReceivableAccounts(): Promise<ModelObject<Account>[]> {
    return await this.accountModel()
      .query()
      .where('accountType', ACCOUNT_TYPE.ACCOUNTS_RECEIVABLE);
  }

  /**
   * Retrieve the customers credit/debit totals
   * @returns
   */
  public async getCustomersTransactions(
    asDate: any,
  ): Promise<ModelObject<AccountTransaction>[]> {
    // Retrieve the receivable accounts A/R.
    const receivableAccounts = await this.getReceivableAccounts();
    const receivableAccountsIds = map(receivableAccounts, 'id');

    // Retrieve the customers transactions of A/R accounts.
    const customersTranasctions = await this.accountTransactionModel()
      .query()
      .onBuild((query) => {
        query.whereIn('accountId', receivableAccountsIds);
        query.modify('filterDateRange', null, asDate);
        query.groupBy('contactId');
        query.sum('credit as credit');
        query.sum('debit as debit');
        query.select('contactId');
      });
    return customersTranasctions;
  }
}
