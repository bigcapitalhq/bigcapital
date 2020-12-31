
import {
  ITrialBalanceSheetQuery,
  ITrialBalanceAccount,
  IAccount,
  IAccountType,
} from 'interfaces';
import FinancialSheet from '../FinancialSheet';
import { flatToNestedArray } from 'utils';

export default class TrialBalanceSheet extends FinancialSheet{
  tenantId: number;
  query: ITrialBalanceSheetQuery;
  accounts: IAccount & { type: IAccountType }[];
  journalFinancial: any;
  baseCurrency: string;

  /**
   * Constructor method.
   * @param {number} tenantId 
   * @param {ITrialBalanceSheetQuery} query 
   * @param {IAccount[]} accounts 
   * @param journalFinancial 
   */
  constructor(
    tenantId: number,
    query: ITrialBalanceSheetQuery,
    accounts: IAccount & { type: IAccountType }[],
    journalFinancial: any,
    baseCurrency: string,
  ) {
    super();

    this.tenantId = tenantId;
    this.query = query;
    this.numberFormat = this.query.numberFormat;
    this.accounts = accounts;
    this.journalFinancial = journalFinancial;
    this.numberFormat = this.query.numberFormat;
    this.baseCurrency = baseCurrency;
  }

  /**
   * Account mapper.
   * @param {IAccount} account 
   */
  private accountMapper(account: IAccount & { type: IAccountType }): ITrialBalanceAccount {
    const trial = this.journalFinancial.getTrialBalanceWithDepands(account.id);

    // Retrieve all entries that associated to the given account.
    const entries = this.journalFinancial.getAccountEntries(account.id)

    return {
      id: account.id,
      parentAccountId: account.parentAccountId,
      name: account.name,
      code: account.code,
      accountNormal: account.type.normal,
      hasTransactions: entries.length > 0,

      credit: trial.credit,
      debit: trial.debit,
      balance: trial.balance,
      currencyCode: this.baseCurrency,

      formattedCredit: this.formatNumber(trial.credit),
      formattedDebit: this.formatNumber(trial.debit),
      formattedBalance: this.formatNumber(trial.balance),
    };
  }

  /**
   * Accounts walker.
   * @param {IAccount[]} accounts 
   */
  private accountsWalker(
    accounts: IAccount & { type: IAccountType }[]
  ): ITrialBalanceAccount[] {
    const flattenAccounts = accounts
      // Mapping the trial balance accounts sections.
      .map((account: IAccount & { type: IAccountType }) => this.accountMapper(account))

      // Filter accounts that have no transaction when `noneTransactions` is on.
      .filter((trialAccount: ITrialBalanceAccount): boolean =>
        !(!trialAccount.hasTransactions && this.query.noneTransactions),
      )
      // Filter accounts that have zero total amount when `noneZero` is on.
      .filter(
        (trialAccount: ITrialBalanceAccount): boolean =>
          !(trialAccount.credit === 0 && trialAccount.debit === 0 && this.query.noneZero)
    );
    
    return flatToNestedArray(
      flattenAccounts,      
      { id: 'id', parentId: 'parentAccountId' },
    );
  }

  /**
   * Retrieve trial balance sheet statement data.
   */
  public reportData() {
    return this.accountsWalker(this.accounts);
  }
}