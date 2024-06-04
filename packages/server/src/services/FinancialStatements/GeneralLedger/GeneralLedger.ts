import { isEmpty, get, last, sumBy } from 'lodash';
import moment from 'moment';
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

/**
 * General ledger sheet.
 */
export default class GeneralLedgerSheet extends FinancialSheet {
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
   * @param {ILedgerEntry} entry -
   * @return {IGeneralLedgerSheetAccountTransaction}
   */
  entryReducer(
    entries: IGeneralLedgerSheetAccountTransaction[],
    entry: ILedgerEntry,
    openingBalance: number
  ): IGeneralLedgerSheetAccountTransaction[] {
    const lastEntry = last(entries);

    const contact = this.repository.contactsById.get(entry.contactId);
    const amount = this.getAmount(
      entry.credit,
      entry.debit,
      entry.accountNormal
    );
    const runningBalance =
      amount + (!isEmpty(entries) ? lastEntry.runningBalance : openingBalance);

    const newEntry = {
      date: entry.date,
      dateFormatted: moment(entry.date).format('YYYY MMM DD'),
      entryId: entry.id,

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
    const entries = this.repository.transactionsLedger
      .whereAccountId(account.id)
      .getEntries();

    return entries.reduce(
      (
        entries: IGeneralLedgerSheetAccountTransaction[],
        entry: ILedgerEntry
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
    const amount = this.repository.openingBalanceTransactionsLedger
      .whereAccountId(account.id)
      .getClosingBalance();
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
    openingBalance: number,
    transactions: IGeneralLedgerSheetAccountTransaction[]
  ): IGeneralLedgerSheetAccountBalance {
    const amount = this.calcClosingBalance(openingBalance, transactions);
    const formattedAmount = this.formatTotalNumber(amount);
    const currencyCode = this.baseCurrency;
    const date = this.query.toDate;

    return { amount, formattedAmount, currencyCode, date };
  }

  private calcClosingBalance(
    openingBalance: number,
    transactions: IGeneralLedgerSheetAccountTransaction[]
  ) {
    return openingBalance + sumBy(transactions, (trans) => trans.amount);
  }

  /**
   * Retreive general ledger accounts sections.
   * @param {IAccount} account
   * @return {IGeneralLedgerSheetAccount}
   */
  private accountMapper(account: IAccount): IGeneralLedgerSheetAccount {
    const openingBalance = this.accountOpeningBalance(account);

    const transactions = this.accountTransactionsMapper(
      account,
      openingBalance.amount
    );
    const closingBalance = this.accountClosingBalance(
      openingBalance.amount,
      transactions
    );

    return {
      id: account.id,
      name: account.name,
      code: account.code,
      index: account.index,
      parentAccountId: account.parentAccountId,
      openingBalance,
      transactions,
      closingBalance,
    };
  }

  /**
   * Retrieve mapped accounts with general ledger transactions and opeing/closing balance.
   * @param {IAccount[]} accounts -
   * @return {IGeneralLedgerSheetAccount[]}
   */
  private accountsWalker(accounts: IAccount[]): IGeneralLedgerSheetAccount[] {
    return (
      accounts
        .map((account: IAccount) => this.accountMapper(account))
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
    return this.accountsWalker(this.repository.accounts);
  }
}
