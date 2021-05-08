import { Inject } from 'typedi';
import moment from 'moment';
import { map } from 'lodash';
import * as R from 'ramda';
import TenancyService from 'services/Tenancy/TenancyService';
import {
  IVendor,
  IVendorBalanceSummaryService,
  IVendorBalanceSummaryQuery,
  IVendorBalanceSummaryStatement,
} from 'interfaces';
import { VendorBalanceSummaryReport } from './VendorBalanceSummary';
import { isEmpty } from 'lodash';
import { ACCOUNT_TYPE } from 'data/AccountTypes';
import Ledger from 'services/Accounting/Ledger';

export default class VendorBalanceSummaryService
  implements IVendorBalanceSummaryService {
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  /**
   * Defaults balance sheet filter query.
   * @return {IVendorBalanceSummaryQuery}
   */
  get defaultQuery(): IVendorBalanceSummaryQuery {
    return {
      asDate: moment().format('YYYY-MM-DD'),
      numberFormat: {
        precision: 2,
        divideOn1000: false,
        showZero: false,
        formatMoney: 'total',
        negativeFormat: 'mines',
      },
      comparison: {
        percentageOfColumn: true,
      },
      noneZero: false,
      noneTransactions: false,
    };
  }

  /**
   * Retrieve the report vendors.
   * @param {number} tenantId
   * @param {number[]} vendorsIds - Vendors ids.
   * @returns {IVendor[]}
   */
  getReportVendors(
    tenantId: number,
    vendorsIds?: number[]
  ): Promise<IVendor[]> {
    const { Vendor } = this.tenancy.models(tenantId);

    return Vendor.query()
      .orderBy('displayName')
      .onBuild((query) => {
        if (!isEmpty(vendorsIds)) {
          query.whereIn('id', vendorsIds);
        }
      });
  }

  getPayableAccounts(tenantId: number) {
    const { Account } = this.tenancy.models(tenantId);

    return Account.query().where('accountType', ACCOUNT_TYPE.ACCOUNTS_PAYABLE);
  }

  /**
   * Retrieve
   * @param tenantId
   * @param asDate
   * @returns
   */
  async getReportVendorsTransactions(tenantId: number, asDate: Date | string) {
    const { AccountTransaction } = this.tenancy.models(tenantId);

    // Retrieve payable accounts .
    const payableAccounts = await this.getPayableAccounts(tenantId);
    const payableAccountsIds = map(payableAccounts, 'id');

    // Retrieve the customers transactions of A/R accounts.
    const customersTranasctions = await AccountTransaction.query().onBuild(
      (query) => {
        query.whereIn('accountId', payableAccountsIds);
        query.modify('filterDateRange', null, asDate);
        query.groupBy('contactId');
        query.sum('credit as credit');
        query.sum('debit as debit');
        query.select('contactId');
      }
    );
    const commonProps = { accountNormal: 'credit', date: asDate };

    return R.map(R.merge(commonProps))(customersTranasctions);
  }

  /**
   * Retrieve the statment of customer balance summary report.
   * @param {number} tenantId - Tenant id.
   * @param {IVendorBalanceSummaryQuery} query -
   * @return {Promise<IVendorBalanceSummaryStatement>}
   */
  async vendorBalanceSummary(
    tenantId: number,
    query: IVendorBalanceSummaryQuery
  ): Promise<IVendorBalanceSummaryStatement> {
    // Settings tenant service.
    const settings = this.tenancy.settings(tenantId);
    const baseCurrency = settings.get({
      group: 'organization',
      key: 'base_currency',
    });

    const filter = { ...this.defaultQuery, ...query };
    this.logger.info(
      '[customer_balance_summary] trying to calculate the report.',
      {
        filter,
        tenantId,
      }
    );
    // Retrieve the vendors transactions.
    const vendorsTransactions = await this.getReportVendorsTransactions(
      tenantId,
      query.asDate
    );
    // Retrieve the customers list ordered by the display name.
    const vendors = await this.getReportVendors(tenantId, query.vendorsIds);

    // Ledger query.
    const ledger = new Ledger(vendorsTransactions);

    // Report instance.
    const reportInstance = new VendorBalanceSummaryReport(
      ledger,
      vendors,
      filter,
      baseCurrency
    );

    return {
      data: reportInstance.reportData(),
      columns: reportInstance.reportColumns(),
      query: filter,
    };
  }
}
