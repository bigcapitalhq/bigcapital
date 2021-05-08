import { Inject } from 'typedi';
import * as R from 'ramda';
import moment from 'moment';
import { map } from 'lodash';
import TenancyService from 'services/Tenancy/TenancyService';
import {
  ITransactionsByCustomersService,
  ITransactionsByCustomersFilter,
  ITransactionsByCustomersStatement,
} from 'interfaces';
import TransactionsByCustomers from './TransactionsByCustomers';
import Ledger from 'services/Accounting/Ledger';
import { ACCOUNT_TYPE } from 'data/AccountTypes';
import AccountRepository from 'repositories/AccountRepository';

export default class TransactionsByCustomersService
  implements ITransactionsByCustomersService {
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
      noneTransactions: false,
    };
  }

  /**
   * Retrieve the accounts receivable.
   * @param {number} tenantId
   * @returns
   */
  async getReceivableAccounts(tenantId: number) {
    const { Account } = this.tenancy.models(tenantId);

    const accounts = await Account.query().where(
      'accountType',
      ACCOUNT_TYPE.ACCOUNTS_RECEIVABLE
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
  async getCustomersOpeningBalance(
    tenantId: number,
    openingDate: Date,
    customersIds?: number[]
  ): Promise<ILedgerEntry[]> {
    const { AccountTransaction } = this.tenancy.models(tenantId);

    const receivableAccounts = await this.getReceivableAccounts(tenantId);
    const receivableAccountsIds = map(receivableAccounts, 'id');

    const openingTransactions = await AccountTransaction.query().modify(
      'contactsOpeningBalance',
      openingDate,
      receivableAccountsIds,
      customersIds
    );
    return R.compose(
      R.map(R.assoc('date', openingDate)),
      R.map(R.assoc('accountNormal', 'debit'))
    )(openingTransactions);
  }

  /**
   *
   * @param {number} tenantId
   * @param {Date|string} openingDate
   * @param {number[]} customersIds
   */
  async getCustomersPeriodTransactions(
    tenantId: number,
    fromDate: Date,
    toDate: Date,
  ): Promise<ILedgerEntry[]> {
    const { AccountTransaction } = this.tenancy.models(tenantId);

    const receivableAccounts = await this.getReceivableAccounts(tenantId);
    const receivableAccountsIds = map(receivableAccounts, 'id');

    const transactions = await AccountTransaction.query().onBuild((query) => {
      // Filter by date.
      query.modify('filterDateRange', fromDate, toDate);

      // Filter by customers.
      query.whereNot('contactId', null);

      // Filter by accounts.
      query.whereIn('accountId', receivableAccountsIds);
    });

    return R.compose(R.map(R.assoc('accountNormal', 'debit')))(transactions);
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
    const { Customer } = this.tenancy.models(tenantId);
    const { accountRepository } = this.tenancy.repositories(tenantId);

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
    const accountsGraph = await accountRepository.getDependencyGraph();
    const customers = await Customer.query().orderBy('displayName');

    const openingBalanceDate = moment(filter.fromDate).subtract(1, 'days').toDate();

    // Retrieve all ledger transactions of the opening balance of.
    const openingBalanceTransactions = await this.getCustomersOpeningBalance(
      tenantId,
      openingBalanceDate,
    );
    // Retrieve all ledger transactions between opeing and closing period.
    const customersTransactions = await this.getCustomersPeriodTransactions(
      tenantId,
      query.fromDate,
      query.toDate,
    );
    // Concats the opening balance and period customer ledger transactions.
    const journalTransactions = [
      ...openingBalanceTransactions,
      ...customersTransactions,
    ];
    const journal = new Ledger(journalTransactions);

    // Transactions by customers data mapper.
    const reportInstance = new TransactionsByCustomers(
      customers,
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
