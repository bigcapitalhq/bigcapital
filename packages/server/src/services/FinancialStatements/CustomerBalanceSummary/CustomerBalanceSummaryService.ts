import { Inject } from 'typedi';
import moment from 'moment';
import { isEmpty, map } from 'lodash';
import TenancyService from '@/services/Tenancy/TenancyService';
import * as R from 'ramda';
import {
  ICustomerBalanceSummaryService,
  ICustomerBalanceSummaryQuery,
  ICustomerBalanceSummaryStatement,
  ICustomer,
  ILedgerEntry,
} from '@/interfaces';
import { CustomerBalanceSummaryReport } from './CustomerBalanceSummary';

import Ledger from '@/services/Accounting/Ledger';
import CustomerBalanceSummaryRepository from './CustomerBalanceSummaryRepository';
import { Tenant } from '@/system/models';

export default class CustomerBalanceSummaryService
  implements ICustomerBalanceSummaryService
{
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  @Inject()
  reportRepository: CustomerBalanceSummaryRepository;

  /**
   * Defaults balance sheet filter query.
   * @return {ICustomerBalanceSummaryQuery}
   */
  get defaultQuery(): ICustomerBalanceSummaryQuery {
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
  private async getReportCustomersEntries(
    tenantId: number,
    asDate: Date | string
  ): Promise<ILedgerEntry[]> {
    const transactions = await this.reportRepository.getCustomersTransactions(
      tenantId,
      asDate
    );
    const commonProps = { accountNormal: 'debit', date: asDate };

    return R.map(R.merge(commonProps))(transactions);
  }

  /**
   * Retrieve the statement of customer balance summary report.
   * @param {number} tenantId
   * @param {ICustomerBalanceSummaryQuery} query
   * @return {Promise<ICustomerBalanceSummaryStatement>}
   */
  async customerBalanceSummary(
    tenantId: number,
    query: ICustomerBalanceSummaryQuery
  ): Promise<ICustomerBalanceSummaryStatement> {
    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    // Merges the default query and request query.
    const filter = { ...this.defaultQuery, ...query };

    this.logger.info(
      '[customer_balance_summary] trying to calculate the report.',
      {
        filter,
        tenantId,
      }
    );
    // Retrieve the customers list ordered by the display name.
    const customers = await this.reportRepository.getCustomers(
      tenantId,
      query.customersIds
    );
    // Retrieve the customers debit/credit totals.
    const customersEntries = await this.getReportCustomersEntries(
      tenantId,
      filter.asDate
    );
    // Ledger query.
    const ledger = new Ledger(customersEntries);

    // Report instance.
    const report = new CustomerBalanceSummaryReport(
      ledger,
      customers,
      filter,
      tenant.metadata.baseCurrency,
    );

    return {
      data: report.reportData(),
      query: filter,
    };
  }
}
