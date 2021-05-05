import { Inject } from 'typedi';
import moment from 'moment';
import TenancyService from 'services/Tenancy/TenancyService';
import Journal from 'services/Accounting/JournalPoster';
import {
  IVendorBalanceSummaryService,
  IVendorBalanceSummaryQuery,
  IVendorBalanceSummaryStatement,
} from 'interfaces';
import { VendorBalanceSummaryReport } from './VendorBalanceSummary';

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
   * Retrieve the statment of customer balance summary report.
   * @param {number} tenantId - Tenant id.
   * @param {IVendorBalanceSummaryQuery} query - 
   * @return {Promise<IVendorBalanceSummaryStatement>}
   */
  async vendorBalanceSummary(
    tenantId: number,
    query: IVendorBalanceSummaryQuery
  ): Promise<IVendorBalanceSummaryStatement> {
    const {
      accountRepository,
      transactionsRepository,
    } = this.tenancy.repositories(tenantId);

    const { Vendor } = this.tenancy.models(tenantId);

    // Settings tenant service.
    const settings = this.tenancy.settings(tenantId);
    const baseCurrency = settings.get({
      group: 'organization', key: 'base_currency',
    });

    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    this.logger.info('[customer_balance_summary] trying to calculate the report.', {
      filter,
      tenantId,
    });
    // Retrieve all accounts on the storage.
    const accounts = await accountRepository.all();
    const accountsGraph = await accountRepository.getDependencyGraph();

    // Retrieve all journal transactions based on the given query.
    const transactions = await transactionsRepository.journal({
      toDate: query.asDate,
    });
    // Transform transactions to journal collection.
    const transactionsJournal = Journal.fromTransactions(
      transactions,
      tenantId,
      accountsGraph
    );
    // Retrieve the customers list ordered by the display name.
    const vendors = await Vendor.query().orderBy('displayName');

    // Report instance.
    const reportInstance = new VendorBalanceSummaryReport(
      transactionsJournal,
      vendors,
      filter,
      baseCurrency,
    );
    // Retrieve the report statement.
    const reportData = reportInstance.reportData();

    // Retrieve the report columns.
    const reportColumns = reportInstance.reportColumns();

    return {
      data: reportData,
      columns: reportColumns,
    };
  }
}
