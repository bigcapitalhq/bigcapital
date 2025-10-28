import { ModelObject } from 'objection';
import * as moment from 'moment';
import * as R from 'ramda';
import { ACCOUNT_TYPE } from '@/constants/accounts';
import { Account } from '@/modules/Accounts/models/Account.model';
import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { Customer } from '@/modules/Customers/models/Customer';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { isEmpty, map } from 'lodash';
import { AccountRepository } from '@/modules/Accounts/repositories/Account.repository';
import { Ledger } from '@/modules/Ledger/Ledger';
import { ITransactionsByCustomersFilter } from './TransactionsByCustomer.types';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { TransactionsByContactRepository } from '../TransactionsByContact/TransactionsByContactRepository';
import { DateInput } from '@/common/types/Date';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable({ scope: Scope.TRANSIENT })
export class TransactionsByCustomersRepository extends TransactionsByContactRepository {
  @Inject(Customer.name)
  private readonly customerModel: TenantModelProxy<typeof Customer>;

  @Inject(Account.name)
  private readonly accountModel: TenantModelProxy<typeof Account>;

  @Inject(AccountTransaction.name)
  private readonly accountTransactionModel: TenantModelProxy<
    typeof AccountTransaction
  >;

  @Inject(AccountRepository)
  private readonly accountRepository: AccountRepository;

  @Inject(TenancyContext)
  private readonly tenancyContext: TenancyContext;

  /**
   * Customers models.
   * @param {ModelObject<Customer>[]} customers
   */
  public customers: ModelObject<Customer>[];

  /**
   * Report filter.
   * @param {ITransactionsByCustomersFilter} filter
   */
  public filter: ITransactionsByCustomersFilter;

  /**
   * Customers periods entries.
   * @param {ILedgerEntry[]} customersPeriodsEntries
   */
  public customersPeriodsEntries: ILedgerEntry[];

  /**
   * Initialize the report data.
   */
  public async asyncInit() {
    await this.initAccountsGraph();
    await this.initCustomers();
    await this.initOpeningBalanceEntries();
    await this.initCustomersPeriodsEntries();
    await this.initLedger();
    await this.initBaseCurrency();
  }

  /**
   * Set the filter.
   * @param {ITransactionsByCustomersFilter} filter
   */
  public setFilter(filter: ITransactionsByCustomersFilter) {
    this.filter = filter;
  }

  /**
   * Initialize the accounts graph.
   */
  async initAccountsGraph() {
    const accountsGraph = await this.accountRepository.getDependencyGraph();
    this.accountsGraph = accountsGraph;
  }

  /**
   * Initialize the customers.
   */
  async initCustomers() {
    // Retrieve the report customers.
    const customers = await this.getCustomers(this.filter.customersIds);
    this.customers = customers;
  }

  /**
   * Initialize the opening balance entries.
   */
  async initOpeningBalanceEntries() {
    const openingBalanceDate = moment(this.filter.fromDate)
      .subtract(1, 'days')
      .toDate();

    // Retrieve all ledger transactions of the opening balance of.
    const openingBalanceEntries =
      await this.getCustomersOpeningBalanceEntries(openingBalanceDate);

    this.openingBalanceEntries = openingBalanceEntries;
  }

  /**
   * Initialize the customers periods entries.
   */
  async initCustomersPeriodsEntries() {
    // Retrieve all ledger transactions between opeing and closing period.
    const customersTransactions = await this.getCustomersPeriodsEntries(
      this.filter.fromDate,
      this.filter.toDate,
    );
    this.customersPeriodsEntries = customersTransactions;
  }

  /**
   * Initialize the ledger.
   */
  async initLedger() {
    // Concats the opening balance and period customer ledger transactions.
    const journalTransactions = [
      ...this.openingBalanceEntries,
      ...this.customersPeriodsEntries,
    ];
    this.ledger = new Ledger(journalTransactions);
  }

  /**
   * Initialize the base currency.
   */
  async initBaseCurrency() {
    const tenantMetadata = await this.tenancyContext.getTenantMetadata();
    this.baseCurrency = tenantMetadata.baseCurrency;
  }

  /**
   * Retrieve the customers opening balance ledger entries.
   * @param {number} tenantId
   * @param {Date} openingDate
   * @param {number[]} customersIds
   * @returns {Promise<ILedgerEntry[]>}
   */
  private async getCustomersOpeningBalanceEntries(
    openingDate: Date,
    customersIds?: number[],
  ): Promise<ILedgerEntry[]> {
    const openingTransactions =
      await this.getCustomersOpeningBalanceTransactions(
        openingDate,
        customersIds,
      );
    // @ts-ignore
    return R.compose(
      R.map(R.assoc('date', openingDate)),
      R.map(R.assoc('accountNormal', 'debit')),
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
    fromDate: DateInput,
    toDate: DateInput,
  ): Promise<ILedgerEntry[]> {
    const transactions = await this.getCustomersPeriodTransactions(
      fromDate,
      toDate,
    );

    // @ts-ignore
    return R.pipe(
      R.map(R.assoc('accountNormal', 'debit')),
      R.map((trans) => ({
        ...trans,
        // @ts-ignore
        referenceTypeFormatted: '',
        // referenceTypeFormatted: trans.referenceTypeFormatted,
      })),
    )(transactions);
  }

  /**
   * Retrieves the report customers.
   * @param {number[]} customersIds - Customers ids.
   * @returns {Promise<ICustomer[]>}
   */
  public async getCustomers(customersIds?: number[]) {
    return this.customerModel()
      .query()
      .onBuild((q) => {
        q.orderBy('displayName');

        if (!isEmpty(customersIds)) {
          q.whereIn('id', customersIds);
        }
      });
  }

  /**
   * Retrieves the accounts receivable.
   * @returns {Promise<IAccount[]>}
   */
  public async getReceivableAccounts(): Promise<Account[]> {
    const accounts = await this.accountModel()
      .query()
      .where('accountType', ACCOUNT_TYPE.ACCOUNTS_RECEIVABLE);
    return accounts;
  }

  /**
   * Retrieve the customers opening balance transactions.
   * @param {number} openingDate - Opening date.
   * @param {number} customersIds - Customers ids.
   * @returns {Promise<IAccountTransaction[]>}
   */
  public async getCustomersOpeningBalanceTransactions(
    openingDate: DateInput,
    customersIds?: number[],
  ): Promise<AccountTransaction[]> {
    const receivableAccounts = await this.getReceivableAccounts();
    const receivableAccountsIds = map(receivableAccounts, 'id');

    const openingTransactions = await this.accountTransactionModel()
      .query()
      .modify(
        'contactsOpeningBalance',
        openingDate,
        receivableAccountsIds,
        customersIds,
      );
    return openingTransactions;
  }

  /**
   * Retrieves the customers periods transactions.
   * @param {DateInput} fromDate - From date.
   * @param {DateInput} toDate - To date.
   * @return {Promise<IAccountTransaction[]>}
   */
  public async getCustomersPeriodTransactions(
    fromDate: DateInput,
    toDate: DateInput,
  ): Promise<AccountTransaction[]> {
    const receivableAccounts = await this.getReceivableAccounts();
    const receivableAccountsIds = map(receivableAccounts, 'id');

    const transactions = await this.accountTransactionModel()
      .query()
      .onBuild((query) => {
        // Filter by date.
        query.modify('filterDateRange', fromDate, toDate);

        // Filter by customers.
        query.whereNot('contactId', null);

        // Filter by accounts.
        query.whereIn('accountId', receivableAccountsIds);
      });
    return transactions;
  }
}
