import { flatten, pick, sumBy } from 'lodash';
import { IProfitLossSheetQuery } from 'interfaces/ProfitLossSheet';
import FinancialSheet from '../FinancialSheet';
import {
  IAccount,
  IAccountType,
  IJournalPoster,
  IProfitLossSheetAccount,
  IProfitLossSheetTotal,
  IProfitLossSheetStatement,
  IProfitLossSheetAccountsSection,
  IProfitLossSheetTotalSection,
} from 'interfaces';
import { flatToNestedArray, dateRangeCollection } from 'utils';
import { ACCOUNT_TYPE } from 'data/AccountTypes';

export default class ProfitLossSheet extends FinancialSheet {
  tenantId: number;
  query: IProfitLossSheetQuery;
  accounts: IAccount & { type: IAccountType }[];
  journal: IJournalPoster;
  dateRangeSet: string[];
  comparatorDateType: string;
  baseCurrency: string;

  /**
   * Constructor method.
   * @param {number} tenantId -
   * @param {IProfitLossSheetQuery} query -
   * @param {IAccount[]} accounts -
   * @param {IJournalPoster} transactionsJournal -
   */
  constructor(
    tenantId: number,
    query: IProfitLossSheetQuery,
    accounts: IAccount & { type: IAccountType }[],
    journal: IJournalPoster,
    baseCurrency: string
  ) {
    super();

    this.tenantId = tenantId;
    this.query = query;
    this.numberFormat = this.query.numberFormat;
    this.accounts = accounts;
    this.journal = journal;
    this.baseCurrency = baseCurrency;
    this.comparatorDateType =
      query.displayColumnsType === 'total' ? 'day' : query.displayColumnsBy;

    this.initDateRangeCollection();
  }

  get otherIncomeAccounts() {
    return this.accounts.filter((a) => a.accountType === ACCOUNT_TYPE.OTHER_INCOME);
  }

  /**
   * Filtering income accounts.
   * @return {IAccount & { type: IAccountType }[]}
   */
  get incomeAccounts() {
    return this.accounts.filter((a) => a.accountType === ACCOUNT_TYPE.INCOME);
  }

  /**
   * Filtering expenses accounts.
   * @return {IAccount & { type: IAccountType }[]}
   */
  get expensesAccounts() {
    return this.accounts.filter((a) => a.accountType === ACCOUNT_TYPE.EXPENSE);
  }

  /**
   * Filter other expenses accounts.
   * @return {IAccount & { type: IAccountType }[]}}
   */
  get otherExpensesAccounts() {
    return this.accounts.filter((a) => a.accountType === ACCOUNT_TYPE.OTHER_EXPENSE);
  }

  /**
   * Filtering cost of sales accounts.
   * @return {IAccount & { type: IAccountType }[]}
   */
  get costOfSalesAccounts() {
    return this.accounts.filter((a) => a.accountType === ACCOUNT_TYPE.COST_OF_GOODS_SOLD);
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
   * Retrieve account total in the query date.
   * @param  {IAccount} account -
   * @return {IProfitLossSheetTotal}
   */
  private getAccountTotal(account: IAccount): IProfitLossSheetTotal {
    const amount = this.journal.getAccountBalance(
      account.id,
      this.query.toDate,
      this.comparatorDateType
    );
    const formattedAmount = this.formatNumber(amount);
    const currencyCode = this.baseCurrency;

    return { amount, formattedAmount, currencyCode };
  }

  /**
   * Retrieve account total periods.
   * @param {IAccount} account -
   * @return {IProfitLossSheetTotal[]}
   */
  private getAccountTotalPeriods(account: IAccount): IProfitLossSheetTotal[] {
    return this.dateRangeSet.map((date) => {
      const amount = this.journal.getAccountBalance(
        account.id,
        date,
        this.comparatorDateType
      );
      const formattedAmount = this.formatNumber(amount);
      const currencyCode = this.baseCurrency;

      return { date, amount, formattedAmount, currencyCode };
    });
  }

  /**
   * Mapping the given account to total result with account metadata.
   * @param  {IAccount} account -
   * @return {IProfitLossSheetAccount}
   */
  private accountMapper(account: IAccount): IProfitLossSheetAccount {
    const entries = this.journal.getAccountEntries(account.id);

    return {
      ...pick(account, ['id', 'index', 'name', 'code', 'parentAccountId']),
      hasTransactions: entries.length > 0,
      total: this.getAccountTotal(account),

      // Date periods when display columns type `periods`.
      ...(this.query.displayColumnsType === 'date_periods' && {
        totalPeriods: this.getAccountTotalPeriods(account),
      }),
    };
  }

  /**
   *
   * @param {IAccount[]} accounts -
   * @return {IProfitLossSheetAccount[]}
   */
  private accountsWalker(
    accounts: IAccount & { type: IAccountType }[]
  ): IProfitLossSheetAccount[] {
    const flattenAccounts = accounts
      .map(this.accountMapper.bind(this))
      // Filter accounts that have no transaction when `noneTransactions` is on.
      .filter(
        (account: IProfitLossSheetAccount) =>
          !(!account.hasTransactions && this.query.noneTransactions)
      )
      // Filter accounts that have zero total amount when `noneZero` is on.
      .filter(
        (account: IProfitLossSheetAccount) =>
          !(account.total.amount === 0 && this.query.noneZero)
      );

    return flatToNestedArray(flattenAccounts, {
      id: 'id',
      parentId: 'parentAccountId',
    });
  }

  /**
   * Retreive the report total section.
   * @param {IAccount[]} accounts -
   * @return {IProfitLossSheetTotal}
   */
  private gatTotalSection(
    accounts: IProfitLossSheetAccount[]
  ): IProfitLossSheetTotal {
    const amount = sumBy(accounts, 'total.amount');
    const formattedAmount = this.formatTotalNumber(amount);
    const currencyCode = this.baseCurrency;

    return { amount, formattedAmount, currencyCode };
  }

  /**
   * Retrieve the report total section in periods display type.
   * @param {IAccount} accounts -
   * @return {IProfitLossSheetTotal[]}
   */
  private getTotalPeriodsSection(
    accounts: IProfitLossSheetAccount[]
  ): IProfitLossSheetTotal[] {
    return this.dateRangeSet.map((date, index) => {
      const amount = sumBy(accounts, `totalPeriods[${index}].amount`);
      const formattedAmount = this.formatTotalNumber(amount);
      const currencyCode = this.baseCurrency;

      return { amount, formattedAmount, currencyCode };
    });
  }

  sectionMapper(sectionAccounts) {
    const accounts = this.accountsWalker(sectionAccounts);
    const total = this.gatTotalSection(accounts);

    return {
      accounts,
      total,
      ...(this.query.displayColumnsType === 'date_periods' && {
        totalPeriods: this.getTotalPeriodsSection(accounts),
      }),
    };
  }

  /**
   * Retrieve income section.
   * @return {IProfitLossSheetIncomeSection}
   */
  private get incomeSection(): IProfitLossSheetAccountsSection {
    return {
      name: 'Income accounts',
      entryNormal: 'credit',
      ...this.sectionMapper(this.incomeAccounts),
    };
  }

  private get otherIncomeSection(): any {
    return {
      name: 'Other Income',
      entryNormal: 'credit',
      ...this.sectionMapper(this.otherIncomeAccounts)
    }
  }

  /**
   * Retreive expenses section.
   * @return {IProfitLossSheetLossSection}
   */
  private get expensesSection(): IProfitLossSheetAccountsSection {
    return {
      name: 'Expense accounts',
      entryNormal: 'debit',
      ...this.sectionMapper(this.expensesAccounts),
    };
  }

  /**
   * Retrieve other expenses section.
   * @return {IProfitLossSheetAccountsSection}
   */
  private get otherExpensesSection(): IProfitLossSheetAccountsSection {
    return {
      name: 'Other expenses accounts',
      entryNormal: 'debit',
      ...this.sectionMapper(this.otherExpensesAccounts),
    };
  }

  /**
   * Cost of sales section.
   * @return {IProfitLossSheetAccountsSection}
   */
  private get costOfSalesSection(): IProfitLossSheetAccountsSection {
    return {
      name: 'Cost of sales',
      entryNormal: 'debit',
      ...this.sectionMapper(this.costOfSalesAccounts),
    };
  }

  private getSummarySectionDatePeriods(
    positiveSections: IProfitLossSheetTotalSection[],
    minesSections: IProfitLossSheetTotalSection[]
  ) {
    return this.dateRangeSet.map((date, index: number) => {
      const totalPositive = sumBy(
        positiveSections,
        `totalPeriods[${index}].amount`
      );
      const totalMines = sumBy(minesSections, `totalPeriods[${index}].amount`);

      const amount = totalPositive - totalMines;
      const formattedAmount = this.formatTotalNumber(amount);
      const currencyCode = this.baseCurrency;

      return { date, amount, formattedAmount, currencyCode };
    });
  }

  private getSummarySectionTotal(
    positiveSections: IProfitLossSheetTotalSection[],
    minesSections: IProfitLossSheetTotalSection[]
  ) {
    const totalPositiveSections = sumBy(positiveSections, 'total.amount');
    const totalMinesSections = sumBy(minesSections, 'total.amount');

    const amount = totalPositiveSections - totalMinesSections;
    const formattedAmount = this.formatTotalNumber(amount);
    const currencyCode = this.baseCurrency;

    return { amount, formattedAmount, currencyCode };
  }

  /**
   * Retrieve the summary section
   * @param
   */
  private getSummarySection(
    sections: IProfitLossSheetTotalSection | IProfitLossSheetTotalSection[],
    subtractSections:
      | IProfitLossSheetTotalSection
      | IProfitLossSheetTotalSection[]
  ): IProfitLossSheetTotalSection {
    const positiveSections = Array.isArray(sections) ? sections : [sections];
    const minesSections = Array.isArray(subtractSections)
      ? subtractSections
      : [subtractSections];

    return {
      total: this.getSummarySectionTotal(positiveSections, minesSections),
      ...(this.query.displayColumnsType === 'date_periods' && {
        totalPeriods: [
          ...this.getSummarySectionDatePeriods(positiveSections, minesSections),
        ],
      }),
    };
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
   * Retrieve profit/loss report data.
   * @return {IProfitLossSheetStatement}
   */
  public reportData(): IProfitLossSheetStatement {
    if (this.journal.isEmpty()) {
      return null;
    }
    const income = this.incomeSection;
    const costOfSales = this.costOfSalesSection;
    const expenses = this.expensesSection;
    const otherExpenses = this.otherExpensesSection;
    const otherIncome = this.otherIncomeSection;

    // - Gross profit = Total income - COGS.
    const grossProfit = this.getSummarySection(income, costOfSales);

    // - Operating profit = Gross profit - Expenses.
    const operatingProfit = this.getSummarySection(grossProfit, [
      expenses,
      costOfSales,
    ]);
    // - Net income = Operating profit - Other expenses.
    const netIncome = this.getSummarySection(operatingProfit, otherExpenses);

    return {
      income,
      costOfSales,
      grossProfit,
      expenses,
      otherIncome,
      otherExpenses,
      netIncome,
      operatingProfit,
    };
  }

  /**
   * Retrieve profit/loss report columns.
   */
  public reportColumns() {
    // Date range collection.
    return this.query.displayColumnsType === 'date_periods'
      ? this.dateRangeColumns()
      : ['total'];
  }
}
