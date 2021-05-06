import { Inject } from 'typedi';
import moment from 'moment';
import { groupBy } from 'lodash';
import TenancyService from 'services/Tenancy/TenancyService';
import {
  ITransactionsByVendorsService,
  ITransactionsByVendorsFilter,
  ITransactionsByVendorsStatement,
} from 'interfaces';
import TransactionsByVendor from './TransactionsByVendor';

export default class TransactionsByVendorsService
  implements ITransactionsByVendorsService {
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  /**
   * Defaults balance sheet filter query.
   * @return {IVendorBalanceSummaryQuery}
   */
  get defaultQuery(): ITransactionsByVendorsFilter {
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
   * @param {ITransactionsByVendorsFilter} query
   * @return {Promise<ITransactionsByVendorsStatement>}
   */
  public async transactionsByVendors(
    tenantId: number,
    query: ITransactionsByVendorsFilter
  ): Promise<ITransactionsByVendorsStatement> {
    const { transactionsRepository } = this.tenancy.repositories(tenantId);
    const { Vendor } = this.tenancy.models(tenantId);

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
    const vendors = await Vendor.query().orderBy('displayName');

    // Retrieve all journal transactions based on the given query.
    const transactions = await transactionsRepository.journal({
      fromDate: query.fromDate,
      toDate: query.toDate,
    });
    // Transactions map by contact id.
    const transactionsMap = new Map(
      Object.entries(groupBy(transactions, 'contactId'))
    );
    // Transactions by customers data mapper.
    const reportInstance = new TransactionsByVendor(
      vendors,
      transactionsMap,
      filter,
      baseCurrency
    );
    // Retrieve the report data.
    const reportData = reportInstance.reportData();

    // Retireve the report columns.
    const reportColumns = reportInstance.reportColumns();

    return {
      data: reportData,
      columns: reportColumns,
    };
  }
}
