import { Inject, Service } from 'typedi';
import { isEmpty, map } from 'lodash';
import { IVendor, IAccount, IAccountTransaction } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ACCOUNT_TYPE } from '@/data/AccountTypes';

@Service()
export default class TransactionsByVendorRepository {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Retrieve the report vendors.
   * @param {number} tenantId
   * @returns {Promise<IVendor[]>}
   */
  public getVendors(
    tenantId: number,
    vendorsIds?: number[]
  ): Promise<IVendor[]> {
    const { Vendor } = this.tenancy.models(tenantId);

    return Vendor.query().onBuild((q) => {
      q.orderBy('displayName');

      if (!isEmpty(vendorsIds)) {
        q.whereIn('id', vendorsIds);
      }
    });
  }

  /**
   * Retrieve the accounts receivable.
   * @param {number} tenantId
   * @returns {Promise<IAccount[]>}
   */
  private async getPayableAccounts(tenantId: number): Promise<IAccount[]> {
    const { Account } = this.tenancy.models(tenantId);

    const accounts = await Account.query().where(
      'accountType',
      ACCOUNT_TYPE.ACCOUNTS_PAYABLE
    );
    return accounts;
  }

  /**
   * Retrieve the customers opening balance transactions.
   * @param {number} tenantId
   * @param {number} openingDate
   * @param {number} customersIds
   * @returns {}
   */
  public async getVendorsOpeningBalance(
    tenantId: number,
    openingDate: Date,
    customersIds?: number[]
  ): Promise<IAccountTransaction[]> {
    const { AccountTransaction } = this.tenancy.models(tenantId);

    const payableAccounts = await this.getPayableAccounts(tenantId);
    const payableAccountsIds = map(payableAccounts, 'id');

    const openingTransactions = await AccountTransaction.query().modify(
      'contactsOpeningBalance',
      openingDate,
      payableAccountsIds,
      customersIds
    );
    return openingTransactions;
  }

  /**
   * Retrieve vendors periods transactions.
   * @param {number} tenantId
   * @param {Date|string} openingDate
   * @param {number[]} customersIds
   */
  public async getVendorsPeriodTransactions(
    tenantId: number,
    fromDate: Date,
    toDate: Date
  ): Promise<IAccountTransaction[]> {
    const { AccountTransaction } = this.tenancy.models(tenantId);

    const receivableAccounts = await this.getPayableAccounts(tenantId);
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
