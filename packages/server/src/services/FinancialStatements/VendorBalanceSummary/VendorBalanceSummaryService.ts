import { Inject } from 'typedi';
import moment from 'moment';
import { map } from 'lodash';
import * as R from 'ramda';
import TenancyService from '@/services/Tenancy/TenancyService';
import {
  IVendor,
  IVendorBalanceSummaryService,
  IVendorBalanceSummaryQuery,
  IVendorBalanceSummaryStatement,
  ILedgerEntry,
} from '@/interfaces';
import { VendorBalanceSummaryReport } from './VendorBalanceSummary';
import Ledger from '@/services/Accounting/Ledger';
import VendorBalanceSummaryRepository from './VendorBalanceSummaryRepository';
import { Tenant } from '@/system/models';

export default class VendorBalanceSummaryService
  implements IVendorBalanceSummaryService
{
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  @Inject()
  reportRepo: VendorBalanceSummaryRepository;

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
      percentageColumn: false,
      noneZero: false,
      noneTransactions: true,
    };
  }

  /**
   * Retrieve the vendors ledger entries.
   * @param {number} tenantId -
   * @param {Date|string} date -
   * @returns {Promise<ILedgerEntry>}
   */
  private async getReportVendorsEntries(
    tenantId: number,
    date: Date | string
  ): Promise<ILedgerEntry[]> {
    const transactions = await this.reportRepo.getVendorsTransactions(
      tenantId,
      date
    );
    const commonProps = { accountNormal: 'credit' };

    return R.map(R.merge(commonProps))(transactions);
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
    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    const filter = { ...this.defaultQuery, ...query };
    this.logger.info(
      '[customer_balance_summary] trying to calculate the report.',
      {
        filter,
        tenantId,
      }
    );
    // Retrieve the vendors transactions.
    const vendorsEntries = await this.getReportVendorsEntries(
      tenantId,
      query.asDate
    );
    // Retrieve the customers list ordered by the display name.
    const vendors = await this.reportRepo.getVendors(
      tenantId,
      query.vendorsIds
    );
    // Ledger query.
    const vendorsLedger = new Ledger(vendorsEntries);

    // Report instance.
    const reportInstance = new VendorBalanceSummaryReport(
      vendorsLedger,
      vendors,
      filter,
      tenant.metadata.baseCurrency
    );

    return {
      data: reportInstance.reportData(),
      columns: reportInstance.reportColumns(),
      query: filter,
    };
  }
}
