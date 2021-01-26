import { pick, get, last } from 'lodash';
import {
  IGeneralLedgerSheetQuery,
  IGeneralLedgerSheetAccount,
  IGeneralLedgerSheetAccountBalance,
  IGeneralLedgerSheetAccountTransaction,
  IAccount,
  IJournalPoster,
  IJournalEntry,
  IContact,
} from 'interfaces';
import FinancialSheet from '../FinancialSheet';

/**
 * General ledger sheet.
 */
export default class GeneralLedgerSheet extends FinancialSheet {
  tenantId: number;
  accounts: IAccount[];
  query: IGeneralLedgerSheetQuery;
  openingBalancesJournal: IJournalPoster;
  closingBalancesJournal: IJournalPoster;
  transactions: IJournalPoster;
  contactsMap: Map<number, IContact>;
  baseCurrency: string;

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
    accounts: IAccount[],
    contactsByIdMap: Map<number, IContact>,
    transactions: IJournalPoster,
    openingBalancesJournal: IJournalPoster,
    closingBalancesJournal: IJournalPoster,
    baseCurrency: string
  ) {
    super();

    this.tenantId = tenantId;
    this.query = query;
    this.numberFormat = this.query.numberFormat;
    this.accounts = accounts;
    this.contactsMap = contactsByIdMap;
    this.transactions = transactions;
    this.openingBalancesJournal = openingBalancesJournal;
    this.closingBalancesJournal = closingBalancesJournal;
    this.baseCurrency = baseCurrency;
  }

  /**
   * Retrieve the transaction amount.
   * @param {number} credit - Credit amount.
   * @param {number} debit - Debit amount.
   * @param {string} normal - Credit or debit.
   */
  getAmount(credit: number, debit: number, normal: string) {
    return normal === 'credit' ? credit - debit : debit - credit;
  }

  /**
   * Entry mapper.
   * @param {IJournalEntry} entry -
   * @return {IGeneralLedgerSheetAccountTransaction}
   */
  entryReducer(
    entries: IGeneralLedgerSheetAccountTransaction[],
    entry: IJournalEntry,
    index: number
  ): IGeneralLedgerSheetAccountTransaction[] {
    const lastEntry = last(entries);
    const openingBalance = 0;

    const contact = this.contactsMap.get(entry.contactId);
    const amount = this.getAmount(
      entry.credit,
      entry.debit,
      entry.accountNormal
    );
    const runningBalance =
      (entries.length === 0
        ? openingBalance
        : lastEntry
        ? lastEntry.runningBalance
          : 0) + amount;

    const newEntry = {
      date: entry.date,
      entryId: entry.id,

      referenceType: entry.referenceType,
      referenceId: entry.referenceId,
      referenceTypeFormatted: entry.referenceTypeFormatted,

      contactName: get(contact, 'displayName'),
      contactType: get(contact, 'contactService'),

      transactionType: entry.transactionType,
      index: entry.index,
      note: entry.note,

      credit: entry.credit,
      debit: entry.debit,
      amount,
      runningBalance,

      formattedAmount: this.formatNumber(amount),
      formattedCredit: this.formatNumber(entry.credit),
      formattedDebit: this.formatNumber(entry.debit),
      formattedRunningBalance: this.formatNumber(runningBalance),

      currencyCode: this.baseCurrency,
    };
    entries.push(newEntry);

    return entries;
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
    const entries = this.transactions.getAccountEntries(account.id);

    return entries.reduce(
      (
        entries: IGeneralLedgerSheetAccountTransaction[],
        entry: IJournalEntry
      ) => {
        return this.entryReducer(entries, entry, openingBalance);
      },
      []
    );
  }

  /**
   * Retrieve account opening balance.
   * @param {IAccount} account
   * @return {IGeneralLedgerSheetAccountBalance}
   */
  private accountOpeningBalance(
    account: IAccount
  ): IGeneralLedgerSheetAccountBalance {
    const amount = this.openingBalancesJournal.getAccountBalance(account.id);
    const formattedAmount = this.formatTotalNumber(amount);
    const currencyCode = this.baseCurrency;
    const date = this.query.fromDate;

    return { amount, formattedAmount, currencyCode, date };
  }

  /**
   * Retrieve account closing balance.
   * @param {IAccount} account
   * @return {IGeneralLedgerSheetAccountBalance}
   */
  private accountClosingBalance(
    account: IAccount
  ): IGeneralLedgerSheetAccountBalance {
    const amount = this.closingBalancesJournal.getAccountBalance(account.id);
    const formattedAmount = this.formatTotalNumber(amount);
    const currencyCode = this.baseCurrency;
    const date = this.query.toDate;

    return { amount, formattedAmount, currencyCode, date };
  }

  /**
   * Retreive general ledger accounts sections.
   * @param {IAccount} account
   * @return {IGeneralLedgerSheetAccount}
   */
  private accountMapper(
    account: IAccount
  ): IGeneralLedgerSheetAccount {
    const openingBalance = this.accountOpeningBalance(account);
    const closingBalance = this.accountClosingBalance(account);

    return {
      id: account.id,
      name: account.name,
      code: account.code,
      index: account.index,
      parentAccountId: account.parentAccountId,
      openingBalance,
      transactions: this.accountTransactionsMapper(
        account,
        openingBalance.amount
      ),
      closingBalance,
    };
  }

  /**
   * Retrieve mapped accounts with general ledger transactions and opeing/closing balance.
   * @param {IAccount[]} accounts -
   * @return {IGeneralLedgerSheetAccount[]}
   */
  private accountsWalker(
    accounts: IAccount[]
  ): IGeneralLedgerSheetAccount[] {
    return (
      accounts
        .map((account: IAccount) =>
          this.accountMapper(account)
        )
        // Filter general ledger accounts that have no transactions
        // when`noneTransactions` is on.
        .filter(
          (generalLedgerAccount: IGeneralLedgerSheetAccount) =>
            !(
              generalLedgerAccount.transactions.length === 0 &&
              this.query.noneTransactions
            )
        )
    );
  }

  /**
   * Retrieve general ledger report data.
   * @return {IGeneralLedgerSheetAccount[]}
   */
  public reportData(): IGeneralLedgerSheetAccount[] {
    return this.accountsWalker(this.accounts);
  }
}
