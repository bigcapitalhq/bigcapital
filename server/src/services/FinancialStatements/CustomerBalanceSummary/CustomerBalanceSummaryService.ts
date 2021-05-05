import { Inject } from 'typedi';
import moment from 'moment';
import TenancyService from 'services/Tenancy/TenancyService';
import Journal from 'services/Accounting/JournalPoster';
import {
  ICustomerBalanceSummaryService,
  ICustomerBalanceSummaryQuery,
  ICustomerBalanceSummaryStatement,
} from 'interfaces';
import { CustomerBalanceSummaryReport } from './CustomerBalanceSummary';

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
   * Retrieve the statment of customer balance summary report.
   * @param {number} tenantId 
   * @param {ICustomerBalanceSummaryQuery} query 
   * @return {Promise<ICustomerBalanceSummaryStatement>}
   */
  async customerBalanceSummary(
    tenantId: number,
    query: ICustomerBalanceSummaryQuery
  ): Promise<ICustomerBalanceSummaryStatement> {
    const {
      accountRepository,
      transactionsRepository,
    } = this.tenancy.repositories(tenantId);

    const { Customer } = this.tenancy.models(tenantId);

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
    const customers = await Customer.query().orderBy('displayName');

    // Report instance.
    const reportInstance = new CustomerBalanceSummaryReport(
      transactionsJournal,
      customers,
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
