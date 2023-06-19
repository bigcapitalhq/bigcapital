import * as R from 'ramda';
import { sumBy, mapValues, get } from 'lodash';
import { ACCOUNT_ROOT_TYPE } from '@/data/AccountTypes';
import { accumSum, dateRangeFromToCollection } from 'utils';
import {
  ICashFlowDatePeriod,
  ICashFlowStatementNetIncomeSection,
  ICashFlowStatementAccountSection,
  ICashFlowStatementSection,
  ICashFlowSchemaTotalSection,
  IFormatNumberSettings,
  ICashFlowStatementTotalSection,
  IDateRange,
  ICashFlowStatementQuery,
} from '@/interfaces';

export const CashFlowStatementDatePeriods = (Base) =>
  class extends Base {
    dateRangeSet: IDateRange[];
    query: ICashFlowStatementQuery;

    /**
     * Initialize date range set.
     */
    private initDateRangeCollection() {
      this.dateRangeSet = dateRangeFromToCollection(
        this.query.fromDate,
        this.query.toDate,
        this.comparatorDateType
      );
    }

    /**
     * Retrieve the date period meta.
     * @param {number} total - Total amount.
     * @param {Date} fromDate - From date.
     * @param {Date} toDate -  To date.
     * @return {ICashFlowDatePeriod}
     */
    private getDatePeriodTotalMeta = (
      total: number,
      fromDate: Date,
      toDate: Date,
      overrideSettings: IFormatNumberSettings = {}
    ): ICashFlowDatePeriod => {
      return this.getDatePeriodMeta(total, fromDate, toDate, {
        money: true,
        ...overrideSettings,
      });
    };

    /**
     * Retrieve the date period meta.
     * @param {number} total - Total amount.
     * @param {Date} fromDate - From date.
     * @param {Date} toDate -  To date.
     * @return {ICashFlowDatePeriod}
     */
    private getDatePeriodMeta = (
      total: number,
      fromDate: Date,
      toDate: Date,
      overrideSettings?: IFormatNumberSettings
    ): ICashFlowDatePeriod => {
      return {
        fromDate: this.getDateMeta(fromDate),
        toDate: this.getDateMeta(toDate),
        total: this.getAmountMeta(total, overrideSettings),
      };
    };

    // Net income --------------------
    /**
     * Retrieve the net income between the given date range.
     * @param {Date} fromDate
     * @param {Date} toDate
     * @returns {number}
     */
    private getNetIncomeDateRange = (fromDate: Date, toDate: Date) => {
      // Mapping income/expense accounts ids.
      const incomeAccountsIds = this.getAccountsIdsByType(
        ACCOUNT_ROOT_TYPE.INCOME
      );
      const expenseAccountsIds = this.getAccountsIdsByType(
        ACCOUNT_ROOT_TYPE.EXPENSE
      );
      // Income closing balance.
      const incomeClosingBalance = accumSum(incomeAccountsIds, (id) =>
        this.netIncomeLedger
          .whereFromDate(fromDate)
          .whereToDate(toDate)
          .whereAccountId(id)
          .getClosingBalance()
      );
      // Expense closing balance.
      const expenseClosingBalance = accumSum(expenseAccountsIds, (id) =>
        this.netIncomeLedger
          .whereToDate(toDate)
          .whereFromDate(fromDate)
          .whereAccountId(id)
          .getClosingBalance()
      );
      // Net income = income - expenses.
      const netIncome = incomeClosingBalance - expenseClosingBalance;

      return netIncome;
    };

    /**
     * Retrieve the net income of date period.
     * @param {IDateRange} dateRange -
     * @retrun {ICashFlowDatePeriod}
     */
    private getNetIncomeDatePeriod = (dateRange): ICashFlowDatePeriod => {
      const total = this.getNetIncomeDateRange(
        dateRange.fromDate,
        dateRange.toDate
      );
      return this.getDatePeriodMeta(
        total,
        dateRange.fromDate,
        dateRange.toDate
      );
    };

    /**
     * Retrieve the net income node between the given date ranges.
     * @param {Date} fromDate
     * @param {Date} toDate
     * @returns {ICashFlowDatePeriod[]}
     */
    private getNetIncomeDatePeriods = (
      section: ICashFlowStatementNetIncomeSection
    ): ICashFlowDatePeriod[] => {
      return this.dateRangeSet.map(this.getNetIncomeDatePeriod.bind(this));
    };

    /**
     * Writes periods property to net income section.
     * @param {ICashFlowStatementNetIncomeSection} section
     * @returns {ICashFlowStatementNetIncomeSection}
     */
    protected assocPeriodsToNetIncomeNode = (
      section: ICashFlowStatementNetIncomeSection
    ): ICashFlowStatementNetIncomeSection => {
      const incomeDatePeriods = this.getNetIncomeDatePeriods(section);
      return R.assoc('periods', incomeDatePeriods, section);
    };

    // Account nodes --------------------
    /**
     * Retrieve the account total between date range.
     * @param {Date} fromDate - From date.
     * @param {Date} toDate - To date.
     * @return {number}
     */
    private getAccountTotalDateRange = (
      node: ICashFlowStatementAccountSection,
      fromDate: Date,
      toDate: Date
    ): number => {
      const closingBalance = this.ledger
        .whereFromDate(fromDate)
        .whereToDate(toDate)
        .whereAccountId(node.id)
        .getClosingBalance();

      return this.amountAdjustment(node.adjustmentType, closingBalance);
    };

    /**
     * Retrieve the given account node total date period.
     * @param {ICashFlowStatementAccountSection} node -
     * @param {Date} fromDate - From date.
     * @param {Date} toDate - To date.
     * @return {ICashFlowDatePeriod}
     */
    private getAccountTotalDatePeriod = (
      node: ICashFlowStatementAccountSection,
      fromDate: Date,
      toDate: Date
    ): ICashFlowDatePeriod => {
      const total = this.getAccountTotalDateRange(node, fromDate, toDate);
      return this.getDatePeriodMeta(total, fromDate, toDate);
    };

    /**
     * Retrieve the accounts date periods nodes of the give account node.
     * @param {ICashFlowStatementAccountSection} node -
     * @return {ICashFlowDatePeriod[]}
     */
    private getAccountDatePeriods = (
      node: ICashFlowStatementAccountSection
    ): ICashFlowDatePeriod[] => {
      return this.getNodeDatePeriods(
        node,
        this.getAccountTotalDatePeriod.bind(this)
      );
    }

    /**
     * Writes `periods` property to account node.
     * @param {ICashFlowStatementAccountSection} node -
     * @return {ICashFlowStatementAccountSection}
     */
    protected assocPeriodsToAccountNode = (
      node: ICashFlowStatementAccountSection
    ): ICashFlowStatementAccountSection => {
      const datePeriods = this.getAccountDatePeriods(node);
      return R.assoc('periods', datePeriods, node);
    }

    // Aggregate node -------------------------
    /**
     * Retrieve total of the given period index for node that has children nodes.
     * @return {number}
     */
    private getChildrenTotalPeriodByIndex = (
      node: ICashFlowStatementSection,
      index: number
    ): number => {
      return sumBy(node.children, `periods[${index}].total.amount`);
    }

    /**
     * Retrieve date period meta of the given node index.
     * @param {ICashFlowStatementSection} node -
     * @param {number} index - Loop index.
     * @param {Date} fromDate - From date.
     * @param {Date} toDate - To date.
     */
    private getChildrenTotalPeriodMetaByIndex(
      node: ICashFlowStatementSection,
      index: number,
      fromDate: Date,
      toDate: Date
    ) {
      const total = this.getChildrenTotalPeriodByIndex(node, index);
      return this.getDatePeriodTotalMeta(total, fromDate, toDate);
    }

    /**
     * Retrieve the date periods of aggregate node.
     * @param {ICashFlowStatementSection} node
     */
    private getAggregateNodeDatePeriods(node: ICashFlowStatementSection) {
      const getChildrenTotalPeriodMetaByIndex = R.curry(
        this.getChildrenTotalPeriodMetaByIndex.bind(this)
      )(node);

      return this.dateRangeSet.map((dateRange, index) =>
        getChildrenTotalPeriodMetaByIndex(
          index,
          dateRange.fromDate,
          dateRange.toDate
        )
      );
    }

    /**
     * Writes `periods` property to aggregate section node.
     * @param {ICashFlowStatementSection} node -
     * @return {ICashFlowStatementSection}
     */
    protected assocPeriodsToAggregateNode = (
      node: ICashFlowStatementSection
    ): ICashFlowStatementSection => {
      const datePeriods = this.getAggregateNodeDatePeriods(node);
      return R.assoc('periods', datePeriods, node);
    };

    // Total equation node --------------------

    private sectionsMapToTotalPeriod = (
      mappedSections: { [key: number]: any },
      index
    ) => {
      return mapValues(
        mappedSections,
        (node) => get(node, `periods[${index}].total.amount`) || 0
      );
    };

    /**
     * Retrieve the date periods of the given total equation.
     * @param {ICashFlowSchemaTotalSection}
     * @param {string} equation -
     * @return {ICashFlowDatePeriod[]}
     */
    private getTotalEquationDatePeriods = (
      node: ICashFlowSchemaTotalSection,
      equation: string,
      nodesTable
    ): ICashFlowDatePeriod[] => {
      return this.getNodeDatePeriods(node, (node, fromDate, toDate, index) => {
        const periodScope = this.sectionsMapToTotalPeriod(nodesTable, index);
        const total = this.evaluateEquation(equation, periodScope);

        return this.getDatePeriodTotalMeta(total, fromDate, toDate);
      });
    };

    /**
     * Associates the total periods of total equation to the given total node..
     * @param {ICashFlowSchemaTotalSection} totalSection -
     * @return {ICashFlowStatementTotalSection}
     */
    protected assocTotalEquationDatePeriods = (
      nodesTable: any,
      equation: string,
      node: ICashFlowSchemaTotalSection
    ): ICashFlowStatementTotalSection => {
      const datePeriods = this.getTotalEquationDatePeriods(
        node,
        equation,
        nodesTable
      );

      return R.assoc('periods', datePeriods, node);
    };

    // Cash at beginning ----------------------

    /**
     * Retrieve the date preioods of the given node and accumulated function.
     * @param {} node
     * @param {}
     * @return {}
     */
    private getNodeDatePeriods = (node, callback) => {
      const curriedCallback = R.curry(callback)(node);

      return this.dateRangeSet.map((dateRange, index) => {
        return curriedCallback(dateRange.fromDate, dateRange.toDate, index);
      });
    };

    /**
     * Retrieve the account total between date range.
     * @param {Date} fromDate - From date.
     * @param {Date} toDate - To date.
     * @return {number}
     */
    private getBeginningCashAccountDateRange = (
      node: ICashFlowStatementSection,
      fromDate: Date,
      toDate: Date
    ) => {
      const cashToDate = this.beginningCashFrom(fromDate);

      return this.cashLedger
        .whereToDate(cashToDate)
        .whereAccountId(node.id)
        .getClosingBalance();
    };

    /**
     * Retrieve the beginning cash date period.
     * @param {ICashFlowStatementSection} node -
     * @param {Date} fromDate - From date.
     * @param {Date} toDate - To date.
     * @return {ICashFlowDatePeriod}
     */
    private getBeginningCashDatePeriod = (
      node: ICashFlowStatementSection,
      fromDate: Date,
      toDate: Date
    ) => {
      const total = this.getBeginningCashAccountDateRange(
        node,
        fromDate,
        toDate
      );
      return this.getDatePeriodTotalMeta(total, fromDate, toDate);
    };

    /**
     * Retrieve the beginning cash account periods.
     * @param {ICashFlowStatementSection} node
     * @return {ICashFlowDatePeriod}
     */
    private getBeginningCashAccountPeriods = (
      node: ICashFlowStatementSection
    ): ICashFlowDatePeriod => {
      return this.getNodeDatePeriods(node, this.getBeginningCashDatePeriod);
    };

    /**
     * Writes `periods` property to cash at beginning date periods.
     * @param {ICashFlowStatementSection} section -
     * @return {ICashFlowStatementSection}
     */
    protected assocCashAtBeginningDatePeriods = (
      node: ICashFlowStatementSection
    ): ICashFlowStatementSection => {
      const datePeriods = this.getAggregateNodeDatePeriods(node);
      return R.assoc('periods', datePeriods, node);
    };

    /**
     * Associates `periods` propery to cash at beginning account node.
     * @param {ICashFlowStatementSection} node -
     * @return {ICashFlowStatementSection}
     */
    protected assocCashAtBeginningAccountDatePeriods = (
      node: ICashFlowStatementSection
    ): ICashFlowStatementSection => {
      const datePeriods = this.getBeginningCashAccountPeriods(node);
      return R.assoc('periods', datePeriods, node);
    };
  };
