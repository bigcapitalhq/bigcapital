import moment from 'moment';
import {
  IAccount,
  IAccountTransaction,
  IContact,
  IGeneralLedgerSheetQuery,
  ITenant,
} from '@/interfaces';
import Ledger from '@/services/Accounting/Ledger';
import { transformToMap } from '@/utils';
import { Tenant } from '@/system/models';

export class GeneralLedgerRepository {
  public filter: IGeneralLedgerSheetQuery;
  public accounts: IAccount[];

  public transactions: IAccountTransaction[];
  public openingBalanceTransactions: IAccountTransaction[];

  public transactionsLedger: Ledger;
  public openingBalanceTransactionsLedger: Ledger;

  public repositories: any;
  public models: any;
  public accountsGraph: any;

  public contacts: IContact;
  public contactsById: Map<number, IContact>;

  public tenantId: number;
  public tenant: ITenant;

  /**
   * Constructor method.
   * @param models
   * @param repositories
   * @param filter
   */
  constructor(
    repositories: any,
    filter: IGeneralLedgerSheetQuery,
    tenantId: number
  ) {
    this.filter = filter;
    this.repositories = repositories;
    this.tenantId = tenantId;
  }

  /**
   * Initialize the G/L report.
   */
  public async asyncInitialize() {
    await this.initTenant();
    await this.initAccounts();
    await this.initAccountsGraph();
    await this.initContacts();
    await this.initTransactions();
    await this.initAccountsOpeningBalance();
  }

  /**
   * Initialize the tenant.
   */
  public async initTenant() {
    this.tenant = await Tenant.query()
      .findById(this.tenantId)
      .withGraphFetched('metadata');
  }

  /**
   * Initialize the accounts.
   */
  public async initAccounts() {
    this.accounts = await this.repositories.accountRepository.all();
  }

  /**
   * Initialize the accounts graph.
   */
  public async initAccountsGraph() {
    this.accountsGraph =
      await this.repositories.accountRepository.getDependencyGraph();
  }

  /**
   * Initialize the contacts.
   */
  public async initContacts() {
    this.contacts = await this.repositories.contactRepository.all();
    this.contactsById = transformToMap(this.contacts, 'id');
  }

  /**
   * Initialize the G/L transactions from/to the given date.
   */
  public async initTransactions() {
    this.transactions = await this.repositories.transactionsRepository.journal({
      fromDate: this.filter.fromDate,
      toDate: this.filter.toDate,
      branchesIds: this.filter.branchesIds,
    });
    // Transform array transactions to journal collection.
    this.transactionsLedger = Ledger.fromTransactions(this.transactions);
  }

  /**
   * Initialize the G/L accounts opening balance.
   */
  public async initAccountsOpeningBalance() {
    // Retreive opening balance credit/debit sumation.
    this.openingBalanceTransactions =
      await this.repositories.transactionsRepository.journal({
        toDate: moment(this.filter.fromDate).subtract(1, 'day'),
        sumationCreditDebit: true,
        branchesIds: this.filter.branchesIds,
      });

    // Accounts opening transactions.
    this.openingBalanceTransactionsLedger = Ledger.fromTransactions(
      this.openingBalanceTransactions
    );
  }
}
