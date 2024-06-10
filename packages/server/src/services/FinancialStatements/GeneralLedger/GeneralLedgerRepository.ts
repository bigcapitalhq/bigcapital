import moment from 'moment';
import * as R from 'ramda';
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
import { flatten, isEmpty, uniq } from 'lodash';

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

  public accountNodesIncludeTransactions: Array<number> = [];
  public accountNodeInclude: Array<number> = [];

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
    await this.initAccountsOpeningBalance();
    this.initAccountNodesIncludeTransactions();
    await this.initTransactions();
    this.initAccountNodesIncluded();
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
    this.accounts = await this.repositories.accountRepository
      .all()
      .orderBy('name', 'ASC');
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
    this.transactions = await this.repositories.transactionsRepository
      .journal({
        fromDate: this.filter.fromDate,
        toDate: this.filter.toDate,
        branchesIds: this.filter.branchesIds,
      })
      .orderBy('date', 'ASC')
      .onBuild((query) => {
        if (this.filter.accountsIds?.length > 0) {
          query.whereIn('accountId', this.accountNodesIncludeTransactions);
        }
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

  /**
   * Initialize the account nodes that should include transactions.
   * @returns {void}
   */
  public initAccountNodesIncludeTransactions() {
    if (isEmpty(this.filter.accountsIds)) {
      return;
    }
    const childrenNodeIds = this.filter.accountsIds?.map(
      (accountId: number) => {
        return this.accountsGraph.dependenciesOf(accountId);
      }
    );
    const nodeIds = R.concat(this.filter.accountsIds, childrenNodeIds);

    this.accountNodesIncludeTransactions = uniq(flatten(nodeIds));
  }

  /**
   * Initialize the account node ids should be included,
   * if the filter by acounts is presented.
   * @returns {void}
   */
  public initAccountNodesIncluded() {
    if (isEmpty(this.filter.accountsIds)) {
      return;
    }
    const nodeIds = this.filter.accountsIds.map((accountId) => {
      const childrenIds = this.accountsGraph.dependenciesOf(accountId);
      const parentIds = this.accountsGraph.dependantsOf(accountId);

      return R.concat(childrenIds, parentIds);
    });

    this.accountNodeInclude = R.compose(
      R.uniq,
      R.flatten,
      R.concat(this.filter.accountsIds)
    )(nodeIds);
  }
}
