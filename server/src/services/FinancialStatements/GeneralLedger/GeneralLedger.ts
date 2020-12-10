import { pick } from 'lodash';
import {
  IGeneralLedgerSheetQuery,
  IGeneralLedgerSheetAccount,
  IGeneralLedgerSheetAccountBalance,
  IGeneralLedgerSheetAccountTransaction,
  IAccount,
  IJournalPoster,
  IAccountType,
  IJournalEntry
} from 'interfaces';
import FinancialSheet from "../FinancialSheet";

export default class GeneralLedgerSheet extends FinancialSheet {
  tenantId: number;
  accounts: IAccount[];
  query: IGeneralLedgerSheetQuery;
  openingBalancesJournal: IJournalPoster;
  closingBalancesJournal: IJournalPoster;
  transactions: IJournalPoster;
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
    transactions: IJournalPoster,
    openingBalancesJournal: IJournalPoster,
    closingBalancesJournal: IJournalPoster,
    baseCurrency: string,
  ) {
    super();

    this.tenantId = tenantId;
    this.query = query;
    this.numberFormat = this.query.numberFormat;
    this.accounts = accounts;
    this.transactions = transactions;
    this.openingBalancesJournal = openingBalancesJournal;
    this.closingBalancesJournal = closingBalancesJournal;
    this.baseCurrency = baseCurrency;
  }

  /**
   * Mapping the account transactions to general ledger transactions of the given account.
   * @param {IAccount} account 
   * @return {IGeneralLedgerSheetAccountTransaction[]}
   */
  private accountTransactionsMapper(
    account: IAccount & { type: IAccountType }
  ): IGeneralLedgerSheetAccountTransaction[] {
    const entries = this.transactions.getAccountEntries(account.id);

    return entries.map((transaction: IJournalEntry): IGeneralLedgerSheetAccountTransaction => {
      let amount = 0;

      if (account.type.normal === 'credit') {
        amount += transaction.credit - transaction.debit;
      } else if (account.type.normal === 'debit') {
        amount += transaction.debit - transaction.credit;
      }
      const formattedAmount = this.formatNumber(amount);

      return {
        ...pick(transaction, ['id', 'note', 'transactionType', 'referenceType',
          'referenceId', 'date']),
        amount,
        formattedAmount,
        currencyCode: this.baseCurrency,
      };
    });
  }

  /**
   * Retrieve account opening balance.
   * @param {IAccount} account 
   * @return {IGeneralLedgerSheetAccountBalance}
   */
  private accountOpeningBalance(account: IAccount): IGeneralLedgerSheetAccountBalance {  
    const amount = this.openingBalancesJournal.getAccountBalance(account.id);
    const formattedAmount = this.formatNumber(amount);
    const currencyCode = this.baseCurrency;
    const date = this.query.fromDate;

    return { amount, formattedAmount, currencyCode, date };
  }

  /**
   * Retrieve account closing balance.
   * @param {IAccount} account 
   * @return {IGeneralLedgerSheetAccountBalance}
   */
  private accountClosingBalance(account: IAccount): IGeneralLedgerSheetAccountBalance {  
    const amount = this.closingBalancesJournal.getAccountBalance(account.id);
    const formattedAmount = this.formatNumber(amount);
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
    account: IAccount & { type: IAccountType },
  ): IGeneralLedgerSheetAccount {
    return {
      ...pick(account, ['id', 'name', 'code', 'index', 'parentAccountId']),
      opening: this.accountOpeningBalance(account),
      transactions: this.accountTransactionsMapper(account),
      closing: this.accountClosingBalance(account),
    }
  }

  /**
   * Retrieve mapped accounts with general ledger transactions and opeing/closing balance.
   * @param {IAccount[]} accounts - 
   * @return {IGeneralLedgerSheetAccount[]}
   */
  private accountsWalker(
    accounts: IAccount & { type: IAccountType }[]
  ): IGeneralLedgerSheetAccount[] {
    return accounts
      .map((account: IAccount & { type: IAccountType }) => this.accountMapper(account))

      // Filter general ledger accounts that have no transactions when `noneTransactions` is on.
      .filter((generalLedgerAccount: IGeneralLedgerSheetAccount) => (
        !(generalLedgerAccount.transactions.length === 0 && this.query.noneTransactions)
      ));
  }

  /**
   * Retrieve general ledger report data.
   * @return {IGeneralLedgerSheetAccount[]}
   */
  public reportData(): IGeneralLedgerSheetAccount[] {
    return this.accountsWalker(this.accounts);
  }
}