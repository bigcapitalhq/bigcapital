import { Inject, Service } from 'typedi';
import { isEmpty, map } from 'lodash';
import { IVendor, IAccount } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ACCOUNT_TYPE } from '@/data/AccountTypes';

@Service()
export default class VendorBalanceSummaryRepository {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Retrieve the report vendors.
   * @param {number} tenantId
   * @param {number[]} vendorsIds - Vendors ids.
   * @returns {IVendor[]}
   */
  public getVendors(
    tenantId: number,
    vendorsIds?: number[]
  ): Promise<IVendor[]> {
    const { Vendor } = this.tenancy.models(tenantId);

    const vendorQuery = Vendor.query().orderBy('displayName');

    if (!isEmpty(vendorsIds)) {
      vendorQuery.whereIn('id', vendorsIds);
    }
    return vendorQuery;
  }

  /**
   * Retrieve the payable accounts.
   * @param {number} tenantId
   * @returns {Promise<IAccount[]>}
   */
  public getPayableAccounts(tenantId: number): Promise<IAccount[]> {
    const { Account } = this.tenancy.models(tenantId);

    return Account.query().where('accountType', ACCOUNT_TYPE.ACCOUNTS_PAYABLE);
  }

  /**
   * Retrieve the vendors transactions.
   * @param {number} tenantId
   * @param {Date} asDate
   * @returns
   */
  public async getVendorsTransactions(tenantId: number, asDate: Date | string) {
    const { AccountTransaction } = this.tenancy.models(tenantId);

    // Retrieve payable accounts .
    const payableAccounts = await this.getPayableAccounts(tenantId);
    const payableAccountsIds = map(payableAccounts, 'id');

    // Retrieve the customers transactions of A/R accounts.
    const customersTransactions = await AccountTransaction.query().onBuild(
      (query) => {
        query.whereIn('accountId', payableAccountsIds);
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
