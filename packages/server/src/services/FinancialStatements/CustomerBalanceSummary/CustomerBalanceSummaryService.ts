import {
  ICustomerBalanceSummaryQuery,
  ICustomerBalanceSummaryService,
  ICustomerBalanceSummaryStatement,
  ILedgerEntry,
} from '@/interfaces';
import Ledger from '@/services/Accounting/Ledger';
import { Tenant } from '@/system/models';
import moment from 'moment';
import { Inject, Service } from 'typedi';
import { CustomerBalanceSummaryReport } from './CustomerBalanceSummary';
import { CustomerBalanceSummaryMeta } from './CustomerBalanceSummaryMeta';
import CustomerBalanceSummaryRepository from './CustomerBalanceSummaryRepository';
const R = require('ramda');
@Service()
export class CustomerBalanceSummaryService implements ICustomerBalanceSummaryService {
  @Inject()
  private reportRepository: CustomerBalanceSummaryRepository;

  @Inject()
  private customerBalanceSummaryMeta: CustomerBalanceSummaryMeta;

  /**
   * Defaults balance sheet filter query.
   * @return {ICustomerBalanceSummaryQuery}
   */
  private get defaultQuery(): ICustomerBalanceSummaryQuery {
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
   * Retrieve the customers ledger entries mapped from accounts transactions.
   * @param {number} tenantId
   * @param {Date|string} asDate
   * @returns {Promise<ILedgerEntry[]>}
   */
  private async getReportCustomersEntries(tenantId: number, asDate: Date | string): Promise<ILedgerEntry[]> {
    const transactions = await this.reportRepository.getCustomersTransactions(tenantId, asDate);
    const commonProps = { accountNormal: 'debit', date: asDate };

    return map(merge(commonProps))(transactions);
  }

  /**
   * Retrieve the statment of customer balance summary report.
   * @param {number} tenantId
   * @param {ICustomerBalanceSummaryQuery} query
   * @return {Promise<ICustomerBalanceSummaryStatement>}
   */
  public async customerBalanceSummary(
    tenantId: number,
    query: ICustomerBalanceSummaryQuery,
  ): Promise<ICustomerBalanceSummaryStatement> {
    const tenant = await Tenant.query().findById(tenantId).withGraphFetched('metadata');

    // Merges the default query and request query.
    const filter = { ...this.defaultQuery, ...query };

    // Retrieve the customers list ordered by the display name.
    const customers = await this.reportRepository.getCustomers(tenantId, query.customersIds);
    // Retrieve the customers debit/credit totals.
    const customersEntries = await this.getReportCustomersEntries(tenantId, filter.asDate);
    // Ledger query.
    const ledger = new Ledger(customersEntries);

    // Report instance.
    const report = new CustomerBalanceSummaryReport(ledger, customers, filter, tenant.metadata.baseCurrency);
    // Retrieve the customer balance summary meta.
    const meta = await this.customerBalanceSummaryMeta.meta(tenantId, filter);

    return {
      data: report.reportData(),
      query: filter,
      meta,
    };
  }
}
