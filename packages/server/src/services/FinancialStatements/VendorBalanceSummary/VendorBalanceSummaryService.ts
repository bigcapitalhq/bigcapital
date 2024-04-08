import {
  ILedgerEntry,
  IVendorBalanceSummaryQuery,
  IVendorBalanceSummaryService,
  IVendorBalanceSummaryStatement,
} from '@/interfaces';
import Ledger from '@/services/Accounting/Ledger';
import TenancyService from '@/services/Tenancy/TenancyService';
import { Tenant } from '@/system/models';
import moment from 'moment';
import { Inject } from 'typedi';
import { VendorBalanceSummaryReport } from './VendorBalanceSummary';
import { VendorBalanceSummaryMeta } from './VendorBalanceSummaryMeta';
import VendorBalanceSummaryRepository from './VendorBalanceSummaryRepository';

const R = require('ramda');
export class VendorBalanceSummaryService implements IVendorBalanceSummaryService {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private reportRepo: VendorBalanceSummaryRepository;

  @Inject()
  private vendorBalanceSummaryMeta: VendorBalanceSummaryMeta;

  /**
   * Defaults balance sheet filter query.
   * @return {IVendorBalanceSummaryQuery}
   */
  private get defaultQuery(): IVendorBalanceSummaryQuery {
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
   *
   * Retrieve the vendors ledger entrjes.
   * @param {number} tenantId -
   * @param {Date|string} date -
   * @returns {Promise<ILedgerEntry>}
   */
  private async getReportVendorsEntries(tenantId: number, date: Date | string): Promise<ILedgerEntry[]> {
    const transactions = await this.reportRepo.getVendorsTransactions(tenantId, date);
    const commonProps = { accountNormal: 'credit' };

    return R.map(R.merge(commonProps))(transactions);
  }

  /**
   * Retrieve the statment of customer balance summary report.
   * @param {number} tenantId - Tenant id.
   * @param {IVendorBalanceSummaryQuery} query -
   * @return {Promise<IVendorBalanceSummaryStatement>}
   */
  public async vendorBalanceSummary(
    tenantId: number,
    query: IVendorBalanceSummaryQuery,
  ): Promise<IVendorBalanceSummaryStatement> {
    const tenant = await Tenant.query().findById(tenantId).withGraphFetched('metadata');

    const filter = { ...this.defaultQuery, ...query };

    // Retrieve the vendors transactions.
    const vendorsEntries = await this.getReportVendorsEntries(tenantId, query.asDate);
    // Retrieve the customers list ordered by the display name.
    const vendors = await this.reportRepo.getVendors(tenantId, query.vendorsIds);
    // Ledger query.
    const vendorsLedger = new Ledger(vendorsEntries);

    // Report instance.
    const reportInstance = new VendorBalanceSummaryReport(vendorsLedger, vendors, filter, tenant.metadata.baseCurrency);
    // Retrieve the vendor balance summary meta.
    const meta = await this.vendorBalanceSummaryMeta.meta(tenantId, filter);

    return {
      data: reportInstance.reportData(),
      query: filter,
      meta,
    };
  }
}
