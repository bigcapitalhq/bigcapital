import { Inject } from 'typedi';
import moment from 'moment';
import { map } from 'lodash';
import TenancyService from 'services/Tenancy/TenancyService';
import * as R from 'ramda';
import { transformToMap } from 'utils';
import {
  ICustomerBalanceSummaryService,
  ICustomerBalanceSummaryQuery,
  ICustomerBalanceSummaryStatement,
} from 'interfaces';
import { CustomerBalanceSummaryReport } from './CustomerBalanceSummary';
import { ACCOUNT_TYPE } from 'data/AccountTypes';

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

  customersBalancesQuery(query) {
    query.groupBy('contactId');
    query.sum('credit as credit');
    query.sum('debit as debit');
    query.select('contactId');
  }

  /**
   * Retrieve the customers credit/debit totals
   * @param {number} tenantId 
   * @returns 
   */
  async getCustomersCreditDebitTotals(tenantId: number) {
    const { AccountTransaction, Account } = this.tenancy.models(tenantId);

    const receivableAccounts = await Account.query().where(
      'accountType',
      ACCOUNT_TYPE.ACCOUNTS_RECEIVABLE
    );
    const receivableAccountsIds = map(receivableAccounts, 'id');

    const customersTotals = await AccountTransaction.query().onBuild((query) => {
      query.whereIn('accountId', receivableAccountsIds);
      this.customersBalancesQuery(query);
    });

    return R.compose(
      (customers) => transformToMap(customers, 'contactId'),
      (customers) => customers.map((customer) => ({
        ...customer,
        balance: customer.debit - customer.credit
      })),
    )(customersTotals);
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
    const { Customer } = this.tenancy.models(tenantId);

    // Settings tenant service.
    const settings = this.tenancy.settings(tenantId);
    const baseCurrency = settings.get({
      group: 'organization',
      key: 'base_currency',
    });

    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    this.logger.info(
      '[customer_balance_summary] trying to calculate the report.',
      {
        filter,
        tenantId,
      }
    );
    // Retrieve the customers list ordered by the display name.
    const customers = await Customer.query().orderBy('displayName');

    // Retrieve the customers debit/credit totals.
    const customersBalances = await this.getCustomersCreditDebitTotals(tenantId);

    // Report instance.
    const reportInstance = new CustomerBalanceSummaryReport(
      customersBalances,
      customers,
      filter,
      baseCurrency
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
