import { sumBy, pick } from 'lodash';
import {
  IBalanceSheetQuery,
  IBalanceSheetStructureSection,
  IBalanceSheetAccountTotal,
  IBalanceSheetAccount,
  IBalanceSheetSection,
  IAccount,
  IJournalPoster,
  IAccountType,
} from 'interfaces';
import { dateRangeCollection, flatToNestedArray } from 'utils';
import BalanceSheetStructure from 'data/BalanceSheetStructure';
import FinancialSheet from '../FinancialSheet';

export default class BalanceSheetStatement extends FinancialSheet {
  query: IBalanceSheetQuery;
  tenantId: number;
  accounts: IAccount & { type: IAccountType }[];
  journalFinancial: IJournalPoster;
  comparatorDateType: string;
  dateRangeSet: string[];
  baseCurrency: string;

  /**
   * Constructor method.
   * @param {number} tenantId -
   * @param {IBalanceSheetQuery} query -
   * @param {IAccount[]} accounts -
   * @param {IJournalFinancial} journalFinancial -
   */
  constructor(
    tenantId: number,
    query: IBalanceSheetQuery,
    accounts: IAccount & { type: IAccountType }[],
    journalFinancial: IJournalPoster,
    baseCurrency: string
  ) {
    super();

    this.tenantId = tenantId;
    this.query = query;
    this.numberFormat = this.query.numberFormat;
    this.accounts = accounts;
    this.journalFinancial = journalFinancial;
    this.baseCurrency = baseCurrency;

    this.comparatorDateType =
      query.displayColumnsType === 'total' ? 'day' : query.displayColumnsBy;

    this.initDateRangeCollection();
  }

  /**
   * Initialize date range set.
   */
  initDateRangeCollection() {
    if (this.query.displayColumnsType === 'date_periods') {
      this.dateRangeSet = dateRangeCollection(
        this.query.fromDate,
        this.query.toDate,
        this.comparatorDateType
      );
    }
  }

  /**
   * Calculates accounts total deeply of the given accounts graph.
   * @param {IBalanceSheetSection[]} sections -
   * @return {IBalanceSheetAccountTotal}
   */
  private getSectionTotal(
    sections: IBalanceSheetSection[]
  ): IBalanceSheetAccountTotal {
    const amount = sumBy(sections, 'total.amount');
    const formattedAmount = this.formatNumber(amount);
    const currencyCode = this.baseCurrency;

    return { amount, formattedAmount, currencyCode };
  }

  /**
   * Retrieve accounts total periods.
   * @param {IBalanceSheetAccount[]} sections -
   * @return {IBalanceSheetAccountTotal[]}
   */
  private getSectionTotalPeriods(
    sections: Array<IBalanceSheetAccount|IBalanceSheetSection>
  ): IBalanceSheetAccountTotal[] {
    return this.dateRangeSet.map((date, index) => {
      const amount = sumBy(sections, `totalPeriods[${index}].amount`);
      const formattedAmount = this.formatNumber(amount);
      const currencyCode = this.baseCurrency;

      return { date, amount, formattedAmount, currencyCode };
    });
  }

  /**
   * Gets the date range set from start to end date.
   * @param {IAccount} account
   * @return {IBalanceSheetAccountTotal[]}
   */
  private getAccountTotalPeriods(
    account: IAccount
  ): IBalanceSheetAccountTotal[] {
    return this.dateRangeSet.map((date) => {
      const amount = this.journalFinancial.getAccountBalance(
        account.id,
        date,
        this.comparatorDateType
      );
      const formattedAmount = this.formatNumber(amount);
      const currencyCode = this.baseCurrency;

      return { amount, formattedAmount, currencyCode, date };
    });
  }

  /**
   * Retrieve account total and total periods with account meta.
   * @param {IAccount} account -
   * @param {IBalanceSheetQuery} query -
   * @return {IBalanceSheetAccount}
   */
  private balanceSheetAccountMapper(account: IAccount): IBalanceSheetAccount {
    // Calculates the closing balance of the given account in the specific date point.
    const amount = this.journalFinancial.getAccountBalance(
      account.id,
      this.query.toDate
    );
    const formattedAmount = this.formatNumber(amount);

    // Retrieve all entries that associated to the given account.
    const entries = this.journalFinancial.getAccountEntries(account.id);

    return {
      ...pick(account, ['id', 'index', 'name', 'code', 'parentAccountId']),
      type: 'account',
      hasTransactions: entries.length > 0,
      // Total date periods.
      ...(this.query.displayColumnsType === 'date_periods' && {
        totalPeriods: this.getAccountTotalPeriods(account),
      }),
      total: {
        amount,
        formattedAmount,
        currencyCode: this.baseCurrency,
      },
    };
  }

  /**
   * Strcuture accounts related mapper.
   * @param {string[]} sectionAccountsTypes -
   * @param {IAccount[]} accounts -
   * @param {IBalanceSheetQuery} query -
   */
  private structureRelatedAccountsMapper(
    sectionAccountsTypes: string[],
    accounts: IAccount & { type: IAccountType }[]
  ): {
    children: IBalanceSheetAccount[];
    total: IBalanceSheetAccountTotal;
  } {
    const filteredAccounts = accounts
      // Filter accounts that associated to the section accounts types.
      .filter(
        (account) => sectionAccountsTypes.indexOf(account.type.childType) !== -1
      )
      .map((account) => this.balanceSheetAccountMapper(account))
      // Filter accounts that have no transaction when `noneTransactions` is on.
      .filter(
        (section: IBalanceSheetAccount) =>
          !(!section.hasTransactions && this.query.noneTransactions)
      )
      // Filter accounts that have zero total amount when `noneZero` is on.
      .filter(
        (section: IBalanceSheetAccount) =>
          !(section.total.amount === 0 && this.query.noneZero)
      );

    // Gets total amount of the given accounts.
    const totalAmount = sumBy(filteredAccounts, 'total.amount');

    return {
      children: flatToNestedArray(filteredAccounts, {
        id: 'id',
        parentId: 'parentAccountId',
      }),
      total: {
        amount: totalAmount,
        formattedAmount: this.formatNumber(totalAmount),
        currencyCode: this.baseCurrency,
      },
      ...(this.query.displayColumnsType === 'date_periods'
        ? {
            totalPeriods: this.getSectionTotalPeriods(filteredAccounts),
          }
        : {}),
    };
  }

  /**
   * Mappes the structure sections.
   * @param {IBalanceSheetStructureSection} structure 
   * @param {IAccount} accounts 
   */
  private structureSectionMapper(
    structure: IBalanceSheetStructureSection,
    accounts: IAccount[]
  ) {
    const children = this.balanceSheetStructureWalker(
      structure.children,
      accounts
    );
    return {
      children,
      total: this.getSectionTotal(children),
      ...(this.query.displayColumnsType === 'date_periods'
        ? {
            totalPeriods: this.getSectionTotalPeriods(children),
          }
        : {}),
    };
  }

  /**
   * Balance sheet structure mapper.
   * @param {IBalanceSheetStructureSection} structure -
   * @return {IBalanceSheetSection}
   */
  private balanceSheetStructureMapper(
    structure: IBalanceSheetStructureSection,
    accounts: IAccount & { type: IAccountType }[]
  ): IBalanceSheetSection {
    const result = {
      name: structure.name,
      sectionType: structure.sectionType,
      type: structure.type,
      ...(structure.type === 'accounts_section')
        ? this.structureRelatedAccountsMapper(
            structure._accountsTypesRelated,
            accounts
          )
        : this.structureSectionMapper(structure, accounts),
    };
    return result;
  }

  /**
   * Balance sheet structure walker.
   * @param  {IBalanceSheetStructureSection[]} reportStructure -
   * @return {IBalanceSheetSection}
   */
  private balanceSheetStructureWalker(
    reportStructure: IBalanceSheetStructureSection[],
    balanceSheetAccounts: IAccount & { type: IAccountType }[]
  ): IBalanceSheetSection[] {
    return (
      reportStructure
        .map((structure: IBalanceSheetStructureSection) =>
          this.balanceSheetStructureMapper(structure, balanceSheetAccounts)
        )
        // Filter the structure sections that have no children.
        .filter(
          (structure: IBalanceSheetSection) =>
            structure.children.length > 0 || structure._forceShow
        )
    );
  }

  /**
   * Retrieve date range columns of the given query.
   * @param {IBalanceSheetQuery} query
   * @return {string[]}
   */
  private dateRangeColumns(): string[] {
    return this.dateRangeSet;
  }

  /**
   * Retrieve balance sheet columns in different display columns types.
   * @return {string[]}
   */
  public reportColumns(): string[] {
    // Date range collection.
    return this.query.displayColumnsType === 'date_periods'
      ? this.dateRangeColumns()
      : ['total'];
  }

  /**
   * Retrieve balance sheet statement data.
   * @return {IBalanceSheetSection[]}
   */
  public reportData(): IBalanceSheetSection[] {
    return this.balanceSheetStructureWalker(
      BalanceSheetStructure,
      this.accounts
    );
  }
}
