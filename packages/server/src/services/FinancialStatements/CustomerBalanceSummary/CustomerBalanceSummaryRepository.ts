import { Inject, Service } from 'typedi';
import { map, isEmpty } from 'lodash';
import { ICustomer, IAccount } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ACCOUNT_TYPE } from '@/data/AccountTypes';

@Service()
export default class CustomerBalanceSummaryRepository {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Retrieve the report customers.
   * @param {number} tenantId
   * @param {number[]} customersIds
   * @returns {ICustomer[]}
   */
  public getCustomers(tenantId: number, customersIds: number[]): ICustomer[] {
    const { Customer } = this.tenancy.models(tenantId);

    return Customer.query()
      .orderBy('displayName')
      .onBuild((query) => {
        if (!isEmpty(customersIds)) {
          query.whereIn('id', customersIds);
        }
      });
  }

  /**
   * Retrieve the A/R accounts.
   * @param {number} tenantId
   * @returns {Promise<IAccount[]>}
   */
  public getReceivableAccounts(tenantId: number): Promise<IAccount> {
    const { Account } = this.tenancy.models(tenantId);

    return Account.query().where(
      'accountType',
      ACCOUNT_TYPE.ACCOUNTS_RECEIVABLE
    );
  }

  /**
   * Retrieve the customers credit/debit totals
   * @param {number} tenantId
   * @returns
   */
  public async getCustomersTransactions(tenantId: number, asDate: any) {
    const { AccountTransaction } = this.tenancy.models(tenantId);

    // Retrieve the receivable accounts A/R.
    const receivableAccounts = await this.getReceivableAccounts(tenantId);
    const receivableAccountsIds = map(receivableAccounts, 'id');

    // Retrieve the customers transactions of A/R accounts.
    const customersTransactions = await AccountTransaction.query().onBuild(
      (query) => {
        query.whereIn('accountId', receivableAccountsIds);
        query.modify('filterDateRange', null, asDate);
        query.groupBy('contactId');
        query.sum('credit as credit');
        query.sum('debit as debit');
        query.select('contactId');
      }
    );
    return customersTransactions;
  }
}
