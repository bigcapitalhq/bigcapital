import { Inject } from 'typedi';
import { isEmpty, map } from 'lodash';
import { IAccount, IAccountTransaction } from '@/interfaces';
import { ACCOUNT_TYPE } from '@/data/AccountTypes';
import HasTenancyService from '@/services/Tenancy/TenancyService';

export default class TransactionsByCustomersRepository {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieve the report customers.
   * @param {number} tenantId
   * @returns {Promise<ICustomer[]>}
   */
  public async getCustomers(tenantId: number, customersIds?: number[]) {
    const { Customer } = this.tenancy.models(tenantId);

    return Customer.query().onBuild((q) => {
      q.orderBy('displayName');

      if (!isEmpty(customersIds)) {
        q.whereIn('id', customersIds);
      }
    });
  }

  /**
   * Retrieve the accounts receivable.
   * @param {number} tenantId
   * @returns {Promise<IAccount[]>}
   */
  public async getReceivableAccounts(tenantId: number): Promise<IAccount[]> {
    const { Account } = this.tenancy.models(tenantId);

    const accounts = await Account.query().where(
      'accountType',
      ACCOUNT_TYPE.ACCOUNTS_RECEIVABLE
    );
    return accounts;
  }

  /**
   * Retrieve the customers opening balance transactions.
   * @param {number} tenantId - Tenant id.
   * @param {number} openingDate - Opening date.
   * @param {number} customersIds - Customers ids.
   * @returns {Promise<IAccountTransaction[]>}
   */
  public async getCustomersOpeningBalanceTransactions(
    tenantId: number,
    openingDate: Date,
    customersIds?: number[]
  ): Promise<IAccountTransaction[]> {
    const { AccountTransaction } = this.tenancy.models(tenantId);

    const receivableAccounts = await this.getReceivableAccounts(tenantId);
    const receivableAccountsIds = map(receivableAccounts, 'id');

    const openingTransactions = await AccountTransaction.query().modify(
      'contactsOpeningBalance',
      openingDate,
      receivableAccountsIds,
      customersIds
    );
    return openingTransactions;
  }

  /**
   * Retrieve the customers periods transactions.
   * @param {number} tenantId - Tenant id.
   * @param {Date|string} openingDate - Opening date.
   * @param {number[]} customersIds - Customers ids.
   * @return {Promise<IAccountTransaction[]>}
   */
  public async getCustomersPeriodTransactions(
    tenantId: number,
    fromDate: Date,
    toDate: Date
  ): Promise<IAccountTransaction[]> {
    const { AccountTransaction } = this.tenancy.models(tenantId);

    const receivableAccounts = await this.getReceivableAccounts(tenantId);
    const receivableAccountsIds = map(receivableAccounts, 'id');

    const transactions = await AccountTransaction.query().onBuild((query) => {
      // Filter by date.
      query.modify('filterDateRange', fromDate, toDate);

      // Filter by customers.
      query.whereNot('contactId', null);

      // Filter by accounts.
      query.whereIn('accountId', receivableAccountsIds);
    });
    return transactions;
  }
}
