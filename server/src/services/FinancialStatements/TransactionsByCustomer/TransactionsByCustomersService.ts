import { Inject } from 'typedi';
import moment from 'moment';
import { groupBy } from 'lodash';
import TenancyService from 'services/Tenancy/TenancyService';
import {
  ITransactionsByCustomersService,
  ITransactionsByCustomersFilter,
  ITransactionsByCustomersStatement,
} from 'interfaces';
import TransactionsByCustomers from './TransactionsByCustomers';

export default class TransactionsByCustomersService implements ITransactionsByCustomersService {
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  /**
   * Defaults balance sheet filter query.
   * @return {ICustomerBalanceSummaryQuery}
   */
  get defaultQuery(): ITransactionsByCustomersFilter {
    return {
      fromDate: moment().format('YYYY-MM-DD'),
      toDate: moment().format('YYYY-MM-DD'),
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
   * Retrieve transactions by by the customers.
   * @param {number} tenantId
   * @param {ITransactionsByCustomersFilter} query
   * @return {Promise<ITransactionsByCustomersStatement>}
   */
  public async transactionsByCustomers(
    tenantId: number,
    query: ITransactionsByCustomersFilter
  ): Promise<ITransactionsByCustomersStatement> {
    const { transactionsRepository } = this.tenancy.repositories(tenantId);
    const { Customer } = this.tenancy.models(tenantId);

    // Settings tenant service.
    const settings = this.tenancy.settings(tenantId);
    const baseCurrency = settings.get({
      group: 'organization',
      key: 'base_currency',
    });

    const customers = await Customer.query().orderBy('displayName');

    // Retrieve all journal transactions based on the given query.
    const transactions = await transactionsRepository.journal({
      fromDate: query.fromDate,
      toDate: query.toDate,
    });
    // Transactions by customers data mapper.
    const reportInstance = new TransactionsByCustomers(
      customers,
      new Map(Object.entries(groupBy(transactions, 'contactId'))),
      baseCurrency
    );
    const reportData = reportInstance.reportData();

    const reportColumns = reportInstance.reportColumns();

    return {
      data: reportData,
      columns: reportColumns,
    };
  }
}
