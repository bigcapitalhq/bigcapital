import { Inject } from 'typedi';
import moment from 'moment';
import * as R from 'ramda';
import { map } from 'lodash';
import TenancyService from 'services/Tenancy/TenancyService';
import {
  IVendor,
  ITransactionsByVendorsService,
  ITransactionsByVendorsFilter,
  ITransactionsByVendorsStatement,
} from 'interfaces';
import TransactionsByVendor from './TransactionsByVendor';
import { ACCOUNT_TYPE } from 'data/AccountTypes';
import Ledger from 'services/Accounting/Ledger';

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
   * Retrieve the report vendors.
   * @param tenantId
   * @returns
   */
  private getReportVendors(tenantId: number): Promise<IVendor[]> {
    const { Vendor } = this.tenancy.models(tenantId);

    return Vendor.query().orderBy('displayName');
  }

  /**
   * Retrieve the accounts receivable.
   * @param {number} tenantId
   * @returns
   */
  private async getPayableAccounts(tenantId: number) {
    const { Account } = this.tenancy.models(tenantId);

    const accounts = await Account.query().where(
      'accountType',
      ACCOUNT_TYPE.ACCOUNTS_PAYABLE
    );
    return accounts;
  }

  /**
   * Retrieve the customers opening balance transactions.
   * @param {number} tenantId
   * @param {number} openingDate
   * @param {number} customersIds
   * @returns {}
   */
  private async getVendorsOpeningBalance(
    tenantId: number,
    openingDate: Date,
    customersIds?: number[]
  ): Promise<ILedgerEntry[]> {
    const { AccountTransaction } = this.tenancy.models(tenantId);

    const payableAccounts = await this.getPayableAccounts(tenantId);
    const payableAccountsIds = map(payableAccounts, 'id');

    const openingTransactions = await AccountTransaction.query().modify(
      'contactsOpeningBalance',
      openingDate,
      payableAccountsIds,
      customersIds
    );
    return R.compose(
      R.map(R.assoc('date', openingDate)),
      R.map(R.assoc('accountNormal', 'credit'))
    )(openingTransactions);
  }

  /**
   *
   * @param {number} tenantId
   * @param {Date|string} openingDate
   * @param {number[]} customersIds
   */
  async getVendorsPeriodTransactions(
    tenantId: number,
    fromDate: Date,
    toDate: Date
  ): Promise<ILedgerEntry[]> {
    const { AccountTransaction } = this.tenancy.models(tenantId);

    const receivableAccounts = await this.getPayableAccounts(tenantId);
    const receivableAccountsIds = map(receivableAccounts, 'id');

    const transactions = await AccountTransaction.query().onBuild((query) => {
      // Filter by date.
      query.modify('filterDateRange', fromDate, toDate);

      // Filter by customers.
      query.whereNot('contactId', null);

      // Filter by accounts.
      query.whereIn('accountId', receivableAccountsIds);
    });

    return R.compose(R.map(R.assoc('accountNormal', 'credit')))(transactions);
  }

  async getReportTransactions(tenantId: number, fromDate: Date, toDate: Date) {
    const openingBalanceDate = moment(fromDate).subtract(1, 'days').toDate();

    return [
      ...(await this.getVendorsOpeningBalance(tenantId, openingBalanceDate)),
      ...(await this.getVendorsPeriodTransactions(tenantId, fromDate, toDate)),
    ];
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
    const { accountRepository } = this.tenancy.repositories(tenantId);
    
    // Settings tenant service.
    const settings = this.tenancy.settings(tenantId);
    const baseCurrency = settings.get({
      group: 'organization',
      key: 'base_currency',
    });

    const filter = { ...this.defaultQuery, ...query };

    // Retrieve the report vendors.
    const vendors = await this.getReportVendors(tenantId);

    // Retrieve the accounts graph.
    const accountsGraph = await accountRepository.getDependencyGraph();

    // Journal transactions.
    const journalTransactions = await this.getReportTransactions(
      tenantId,
      filter.fromDate,
      filter.toDate
    );
    // Ledger collection.
    const journal = new Ledger(journalTransactions);

    // Transactions by customers data mapper.
    const reportInstance = new TransactionsByVendor(
      vendors,
      accountsGraph,
      journal,
      filter,
      baseCurrency
    );
    return {
      data: reportInstance.reportData(),
      columns: reportInstance.reportColumns(),
      query: filter,
    };
  }
}
