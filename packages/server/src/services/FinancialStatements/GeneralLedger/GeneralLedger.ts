import { isEmpty, get, last, sumBy, first, head } from 'lodash';
import moment from 'moment';
import * as R from 'ramda';
import {
  IGeneralLedgerSheetQuery,
  IGeneralLedgerSheetAccount,
  IGeneralLedgerSheetAccountBalance,
  IGeneralLedgerSheetAccountTransaction,
  IAccount,
  ILedgerEntry,
} from '@/interfaces';
import FinancialSheet from '../FinancialSheet';
import { GeneralLedgerRepository } from './GeneralLedgerRepository';
import { FinancialSheetStructure } from '../FinancialSheetStructure';
import { flatToNestedArray } from '@/utils';
import Ledger from '@/services/Accounting/Ledger';

/**
 * General ledger sheet.
 */
export default class GeneralLedgerSheet extends R.compose(
  FinancialSheetStructure
)(FinancialSheet) {
  tenantId: number;
  query: IGeneralLedgerSheetQuery;
  baseCurrency: string;
  i18n: any;
  repository: GeneralLedgerRepository;

  /**
   * Constructor method.
   * @param {number} tenantId -
   * @param {IAccount[]} accounts -
   * @param {IJournalPoster} transactions -
   * @param {IJournalPoster} openingBalancesJournal -
   * @param {IJournalPoster} closingBalancesJournal -
   */
  constructor(
    tenantId: number,
    query: IGeneralLedgerSheetQuery,
    repository: GeneralLedgerRepository,
    i18n
  ) {
    super();

    this.tenantId = tenantId;
    this.query = query;
    this.numberFormat = this.query.numberFormat;
    this.repository = repository;
    this.baseCurrency = this.repository.tenant.metadata.currencyCode;
    this.i18n = i18n;
  }

  /**
   * Calculate the running balance.
   * @param {number} amount - Transaction amount.
   * @param {number} lastRunningBalance - Last running balance.
   * @param {number} openingBalance - Opening balance.
   * @return {number} Running balance.
   */
  calculateRunningBalance(amount: number, lastRunningBalance: number): number {
    return amount + lastRunningBalance;
  }

  /**
   * Entry mapper.
   * @param {ILedgerEntry} entry -
   * @return {IGeneralLedgerSheetAccountTransaction}
   */
  private getEntryRunningBalance(
    entry: ILedgerEntry,
    openingBalance: number,
    runningBalance?: number
  ): number {
    const lastRunningBalance = runningBalance || openingBalance;

    const amount = Ledger.getAmount(
      entry.credit,
      entry.debit,
      entry.accountNormal
    );
    return this.calculateRunningBalance(amount, lastRunningBalance);
  }

  /**
   *
   * @param entry
   * @param runningBalance
   * @returns
   */
  private entryMapper(entry: ILedgerEntry, runningBalance: number) {
    const contact = this.repository.contactsById.get(entry.contactId);
    const amount = Ledger.getAmount(
      entry.credit,
      entry.debit,
      entry.accountNormal
    );
    return {
      id: entry.id,
      date: entry.date,
      dateFormatted: moment(entry.date).format('YYYY MMM DD'),

      transactionNumber: entry.transactionNumber,
      referenceType: entry.referenceType,
      referenceId: entry.referenceId,
      referenceTypeFormatted: this.i18n.__(entry.referenceTypeFormatted),

      contactName: get(contact, 'displayName'),
      contactType: get(contact, 'contactService'),

      transactionType: entry.transactionType,
      index: entry.index,
      note: entry.note,

      credit: entry.credit,
      debit: entry.debit,
      amount,
      runningBalance,

      formattedAmount: this.formatNumber(amount, { excerptZero: false }),
      formattedCredit: this.formatNumber(entry.credit, { excerptZero: false }),
      formattedDebit: this.formatNumber(entry.debit, { excerptZero: false }),
      formattedRunningBalance: this.formatNumber(runningBalance, {
        excerptZero: false,
      }),

      currencyCode: this.baseCurrency,
    } as IGeneralLedgerSheetAccountTransaction;
  }

  /**
   * Mapping the account transactions to general ledger transactions of the given account.
   * @param {IAccount} account
   * @return {IGeneralLedgerSheetAccountTransaction[]}
   */
  private accountTransactionsMapper(
    account: IAccount,
    openingBalance: number
  ): IGeneralLedgerSheetAccountTransaction[] {
    const entries = this.repository.transactionsLedger
      .whereAccountId(account.id)
      .getEntries();

    return entries
      .reduce((prev: Array<[number, ILedgerEntry]>, current: ILedgerEntry) => {
        const prevEntry = last(prev);
        const prevRunningBalance = head(prevEntry) as number;
        const amount = this.getEntryRunningBalance(
          current,
          openingBalance,
          prevRunningBalance
        );
        return [...prev, [amount, current]];
      }, [])
      .map((entryPair: [number, ILedgerEntry]) => {
        const [runningBalance, entry] = entryPair;

        return this.entryMapper(entry, runningBalance);
      });
  }

  /**
   * Retrieves the given account opening balance.
   * @param {number} accountId
   * @returns {number}
   */
  private accountOpeningBalance(accountId: number): number {
    return this.repository.openingBalanceTransactionsLedger
      .whereAccountId(accountId)
      .getClosingBalance();
  }

  /**
   * Retrieve the given account opening balance.
   * @param {IAccount} account
   * @return {IGeneralLedgerSheetAccountBalance}
   */
  private accountOpeningBalanceTotal(
    accountId: number
  ): IGeneralLedgerSheetAccountBalance {
    const amount = this.accountOpeningBalance(accountId);
    const formattedAmount = this.formatTotalNumber(amount);
    const currencyCode = this.baseCurrency;
    const date = this.query.fromDate;

    return { amount, formattedAmount, currencyCode, date };
  }

  /**
   * Retrieves the given account closing balance.
   * @param {number} accountId
   * @returns {number}
   */
  private accountClosingBalance(accountId: number): number {
    const openingBalance = this.repository.openingBalanceTransactionsLedger
      .whereAccountId(accountId)
      .getClosingBalance();

    const transactionsBalance = this.repository.transactionsLedger
      .whereAccountId(accountId)
      .getClosingBalance();

    return openingBalance + transactionsBalance;
  }

  /**
   * Retrieves the given account closing balance.
   * @param {IAccount} account
   * @return {IGeneralLedgerSheetAccountBalance}
   */
  private accountClosingBalanceTotal(
    accountId: number
  ): IGeneralLedgerSheetAccountBalance {
    const amount = this.accountClosingBalance(accountId);
    const formattedAmount = this.formatTotalNumber(amount);
    const currencyCode = this.baseCurrency;
    const date = this.query.toDate;

    return { amount, formattedAmount, currencyCode, date };
  }

  /**
   * Retrieves the given account closing balance with subaccounts.
   * @param {number} accountId
   * @returns {number}
   */
  private accountClosingBalanceWithSubaccounts = (
    accountId: number
  ): number => {
    const depsAccountsIds =
      this.repository.accountsGraph.dependenciesOf(accountId);

    const openingBalance = this.repository.openingBalanceTransactionsLedger
      .whereAccountsIds([...depsAccountsIds, accountId])
      .getClosingBalance();

    const transactionsBalanceWithSubAccounts =
      this.repository.transactionsLedger
        .whereAccountsIds([...depsAccountsIds, accountId])
        .getClosingBalance();

    const closingBalance = openingBalance + transactionsBalanceWithSubAccounts;

    return closingBalance;
  };

  /**
   * Retrieves the closing balance with subaccounts total node.
   * @param {number} accountId
   * @returns {IGeneralLedgerSheetAccountBalance}
   */
  private accountClosingBalanceWithSubaccountsTotal = (
    accountId: number
  ): IGeneralLedgerSheetAccountBalance => {
    const amount = this.accountClosingBalanceWithSubaccounts(accountId);
    const formattedAmount = this.formatTotalNumber(amount);
    const currencyCode = this.baseCurrency;
    const date = this.query.toDate;

    return { amount, formattedAmount, currencyCode, date };
  };

  /**
   * Detarmines whether the closing balance subaccounts node should be exist.
   * @param {number} accountId
   * @returns {boolean}
   */
  private isAccountNodeIncludesClosingSubaccounts = (accountId: number) => {
    // Retrun early if there is no accounts in the filter so
    // return closing subaccounts in all cases.
    if (isEmpty(this.query.accountsIds)) {
      return true;
    }
    // Returns true if the given account id included in the filter.
    const isIncluded = this.query.accountsIds.includes(accountId);

    const parentAccountIds =
      this.repository.accountsGraph.dependantsOf(accountId);

    // Returns true if one of the parent account id exists in the filter.
    const accountIdInChildren = R.any(
      (parentAccountId) => R.includes(parentAccountId, this.query.accountsIds),
      parentAccountIds
    );
    return isIncluded || accountIdInChildren;
  };

  /**
   * Retreive general ledger accounts sections.
   * @param {IAccount} account
   * @return {IGeneralLedgerSheetAccount}
   */
  private accountMapper = (account: IAccount): IGeneralLedgerSheetAccount => {
    const openingBalance = this.accountOpeningBalanceTotal(account.id);
    const transactions = this.accountTransactionsMapper(
      account,
      openingBalance.amount
    );
    const closingBalance = this.accountClosingBalanceTotal(account.id);
    const closingBalanceSubaccounts =
      this.accountClosingBalanceWithSubaccountsTotal(account.id);

    return R.compose(
      R.when(
        () => this.isAccountNodeIncludesClosingSubaccounts(account.id),
        R.assoc('closingBalanceSubaccounts', closingBalanceSubaccounts)
      )
    )({
      id: account.id,
      name: account.name,
      code: account.code,
      index: account.index,
      parentAccountId: account.parentAccountId,
      openingBalance,
      transactions,
      closingBalance,
    });
  };

  /**
   * Maps over deep nodes to retrieve the G/L account node.
   * @param {IAccount[]} accounts
   * @returns {IGeneralLedgerSheetAccount[]}
   */
  private accountNodesDeepMap = (
    accounts: IAccount[]
  ): IGeneralLedgerSheetAccount[] => {
    return this.mapNodesDeep(accounts, this.accountMapper);
  };

  /**
   * Transformes the flatten nodes to nested nodes.
   */
  private nestedAccountsNode = (flattenAccounts: IAccount[]): IAccount[] => {
    return flatToNestedArray(flattenAccounts, {
      id: 'id',
      parentId: 'parentAccountId',
    });
  };

  /**
   * Filters account nodes.
   * @param {IGeneralLedgerSheetAccount[]} nodes
   * @returns  {IGeneralLedgerSheetAccount[]}
   */
  private filterAccountNodesByTransactionsFilter = (
    nodes: IGeneralLedgerSheetAccount[]
  ): IGeneralLedgerSheetAccount[] => {
    return this.filterNodesDeep(
      nodes,
      (account: IGeneralLedgerSheetAccount) =>
        !(account.transactions.length === 0 && this.query.noneTransactions)
    );
  };

  /**
   * Filters account nodes by the acounts filter.
   * @param {IAccount[]} nodes
   * @returns {IAccount[]}
   */
  private filterAccountNodesByAccountsFilter = (
    nodes: IAccount[]
  ): IAccount[] => {
    return this.filterNodesDeep(nodes, (node: IGeneralLedgerSheetAccount) => {
      if (R.isEmpty(this.query.accountsIds)) {
        return true;
      }
      // Returns true if the given account id exists in the filter.
      const isIncluded = this.query.accountsIds?.includes(node.id);

      const parentAccountIds = this.repository.accountsGraph.dependantsOf(
        node.id
      );
      // Returns true if one of th parent account ids exist in the filter.
      const oneParentAccountIdExistInFilter = parentAccountIds.some((id) =>
        this.query.accountsIds?.includes(id)
      );
      return isIncluded || oneParentAccountIdExistInFilter;
    });
  };

  /**
   * Retrieves mapped accounts with general ledger transactions and
   * opeing/closing balance.
   * @param {IAccount[]} accounts -
   * @return {IGeneralLedgerSheetAccount[]}
   */
  private accountsWalker(accounts: IAccount[]): IGeneralLedgerSheetAccount[] {
    return R.compose(
      R.defaultTo([]),
      this.filterAccountNodesByTransactionsFilter,
      this.accountNodesDeepMap,
      R.defaultTo([]),
      this.filterAccountNodesByAccountsFilter,
      this.nestedAccountsNode
    )(accounts);
  }

  /**
   * Retrieves general ledger report data.
   * @return {IGeneralLedgerSheetAccount[]}
   */
  public reportData(): IGeneralLedgerSheetAccount[] {
    return this.accountsWalker(this.repository.accounts);
  }
}
