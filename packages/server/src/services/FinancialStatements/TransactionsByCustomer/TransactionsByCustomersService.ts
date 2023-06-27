import { Inject } from 'typedi';
import * as R from 'ramda';
import moment from 'moment';
import TenancyService from '@/services/Tenancy/TenancyService';
import {
  ITransactionsByCustomersService,
  ITransactionsByCustomersFilter,
  ITransactionsByCustomersStatement,
  ILedgerEntry,
} from '@/interfaces';
import TransactionsByCustomers from './TransactionsByCustomers';
import Ledger from '@/services/Accounting/Ledger';
import TransactionsByCustomersRepository from './TransactionsByCustomersRepository';
import { Tenant } from '@/system/models';

export default class TransactionsByCustomersService
  implements ITransactionsByCustomersService
{
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  @Inject()
  reportRepository: TransactionsByCustomersRepository;

  /**
   * Defaults balance sheet filter query.
   * @return {ICustomerBalanceSummaryQuery}
   */
  get defaultQuery(): ITransactionsByCustomersFilter {
    return {
      fromDate: moment().startOf('year').format('YYYY-MM-DD'),
      toDate: moment().endOf('year').format('YYYY-MM-DD'),
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
      noneTransactions: true,
      customersIds: [],
    };
  }

  /**
   * Retrieve the customers opening balance ledger entries.
   * @param {number} tenantId
   * @param {Date} openingDate
   * @param {number[]} customersIds
   * @returns {Promise<ILedgerEntry[]>}
   */
  private async getCustomersOpeningBalanceEntries(
    tenantId: number,
    openingDate: Date,
    customersIds?: number[]
  ): Promise<ILedgerEntry[]> {
    const openingTransactions =
      await this.reportRepository.getCustomersOpeningBalanceTransactions(
        tenantId,
        openingDate,
        customersIds
      );

    return R.compose(
      R.map(R.assoc('date', openingDate)),
      R.map(R.assoc('accountNormal', 'debit'))
    )(openingTransactions);
  }

  /**
   * Retrieve the customers periods ledger entries.
   * @param {number} tenantId
   * @param {Date} fromDate
   * @param {Date} toDate
   * @returns {Promise<ILedgerEntry[]>}
   */
  private async getCustomersPeriodsEntries(
    tenantId: number,
    fromDate: Date | string,
    toDate: Date | string
  ): Promise<ILedgerEntry[]> {
    const transactions =
      await this.reportRepository.getCustomersPeriodTransactions(
        tenantId,
        fromDate,
        toDate
      );
    return R.compose(
      R.map(R.assoc('accountNormal', 'debit')),
      R.map((trans) => ({
        ...trans,
        referenceTypeFormatted: trans.referenceTypeFormatted,
      }))
    )(transactions);
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
    const { accountRepository } = this.tenancy.repositories(tenantId);
    const i18n = this.tenancy.i18n(tenantId);

    // Retrieve tenant information.
    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    const accountsGraph = await accountRepository.getDependencyGraph();

    // Retrieve the report customers.
    const customers = await this.reportRepository.getCustomers(
      tenantId,
      filter.customersIds
    );

    const openingBalanceDate = moment(filter.fromDate)
      .subtract(1, 'days')
      .toDate();

    // Retrieve all ledger transactions of the opening balance of.
    const openingBalanceEntries = await this.getCustomersOpeningBalanceEntries(
      tenantId,
      openingBalanceDate
    );
    // Retrieve all ledger transactions between opening and closing period.
    const customersTransactions = await this.getCustomersPeriodsEntries(
      tenantId,
      query.fromDate,
      query.toDate
    );
    // Concats the opening balance and period customer ledger transactions.
    const journalTransactions = [
      ...openingBalanceEntries,
      ...customersTransactions,
    ];
    const journal = new Ledger(journalTransactions);

    // Transactions by customers data mapper.
    const reportInstance = new TransactionsByCustomers(
      customers,
      accountsGraph,
      journal,
      filter,
      tenant.metadata.baseCurrency,
      i18n
    );

    return {
      data: reportInstance.reportData(),
      columns: reportInstance.reportColumns(),
      query: filter,
    };
  }
}
