import { Inject } from 'typedi';
import moment from 'moment';
import { isEmpty, map } from 'lodash';
import TenancyService from 'services/Tenancy/TenancyService';
import * as R from 'ramda';
import {
  ICustomerBalanceSummaryService,
  ICustomerBalanceSummaryQuery,
  ICustomerBalanceSummaryStatement,
  ICustomer
} from 'interfaces';
import { CustomerBalanceSummaryReport } from './CustomerBalanceSummary';
import { ACCOUNT_TYPE } from 'data/AccountTypes';
import Ledger from 'services/Accounting/Ledger';

export default class CustomerBalanceSummaryService
  implements ICustomerBalanceSummaryService {
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

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
      comparison: {
        percentageOfColumn: true,
      },
      noneZero: false,
      noneTransactions: false,
    };
  }

  /**
   * Retrieve the A/R accounts.
   * @param tenantId
   * @returns
   */
  private getReceivableAccounts(tenantId: number) {
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
  private async getReportCustomersTransactions(tenantId: number, asDate: any) {
    const { AccountTransaction } = this.tenancy.models(tenantId);

    // Retrieve the receivable accounts A/R.
    const receivableAccounts = await this.getReceivableAccounts(tenantId);
    const receivableAccountsIds = map(receivableAccounts, 'id');

    // Retrieve the customers transactions of A/R accounts.
    const customersTranasctions = await AccountTransaction.query().onBuild(
      (query) => {
        query.whereIn('accountId', receivableAccountsIds);
        query.modify('filterDateRange', null, asDate);
        query.groupBy('contactId');
        query.sum('credit as credit');
        query.sum('debit as debit');
        query.select('contactId');
      }
    );
    const commonProps = { accountNormal: 'debit', date: asDate };

    return R.map(R.merge(commonProps))(customersTranasctions);
  }

  /**
   * Retrieve the report customers.
   * @param {number} tenantId 
   * @param {number[]} customersIds 
   * @returns {ICustomer[]}
   */
  private getReportCustomers(tenantId: number, customersIds: number[]): ICustomer[] {
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
   * Retrieve the statment of customer balance summary report.
   * @param {number} tenantId
   * @param {ICustomerBalanceSummaryQuery} query
   * @return {Promise<ICustomerBalanceSummaryStatement>}
   */
  async customerBalanceSummary(
    tenantId: number,
    query: ICustomerBalanceSummaryQuery
  ): Promise<ICustomerBalanceSummaryStatement> {
    // Settings tenant service.
    const settings = this.tenancy.settings(tenantId);
    const baseCurrency = settings.get({
      group: 'organization',
      key: 'base_currency',
    });
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
    const customers = await this.getReportCustomers(
      tenantId,
      query.customersIds
    );
    // Retrieve the customers debit/credit totals.
    const customersTransactions = await this.getReportCustomersTransactions(
      tenantId,
      filter.asDate
    );
    // Ledger query.
    const ledger = Ledger.fromTransactions(customersTransactions);

    // Report instance.
    const report = new CustomerBalanceSummaryReport(
      ledger,
      customers,
      filter,
      baseCurrency
    );

    return {
      data: report.reportData(),
      columns: report.reportColumns(),
      query: filter
    };
  }
}
