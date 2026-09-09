import { sumBy, mapValues, get } from 'lodash';
import * as moment from 'moment';
import { ACCOUNT_ROOT_TYPE } from '@/constants/accounts';
import {
  ICashFlowDatePeriod,
  ICashFlowStatementAccountMeta,
  ICashFlowStatementNetIncomeSection,
  ICashFlowStatementSection,
  ICashFlowStatementTotalSection,
  ICashFlowStatementQuery,
  IDateRange,
} from './Cashflow.types';
import { IFormatNumberSettings } from '../../types/Report.types';
import { dateRangeFromToCollection } from '@/utils/date-range-collection';
import { accumSum } from '@/utils/accum-sum';
import { FinancialSheet } from '../../common/FinancialSheet';
import { GConstructor } from '@/common/types/Constructor';
import { Ledger } from '@/modules/Ledger/Ledger';
import { assoc } from '@/common/fp';

export const CashFlowStatementDatePeriods = <
  T extends GConstructor<FinancialSheet>,
>(
  Base: T,
) =>
  class extends Base {
    dateRangeSet: IDateRange[];
    query: ICashFlowStatementQuery;
    netIncomeLedger: Ledger;
    ledger: Ledger;
    cashLedger: Ledger;
    comparatorDateType: string;

    getAccountsIdsByType: (accountType: string) => number[];
    amountAdjustment: (direction: string, amount: number) => number;
    evaluateEquation: (
      equation: string,
      scope: { [key: string | number]: number },
    ) => number;
    beginningCashFrom: (fromDate: string | Date) => Date;

    /**
     * Initialize date range set.
     */
    public initDateRangeCollection() {
      this.dateRangeSet = dateRangeFromToCollection(
        this.query.fromDate,
        this.query.toDate,
        this.comparatorDateType as moment.unitOfTime.StartOf,
      );
    }

    /**
     * Retrieve the date period meta.
     * @param {number} total - Total amount.
     * @param {Date} fromDate - From date.
     * @param {Date} toDate -  To date.
     * @return {ICashFlowDatePeriod}
     */
    public getDatePeriodTotalMeta = (
      total: number,
      fromDate: Date,
      toDate: Date,
      overrideSettings: IFormatNumberSettings = {},
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
    public getDatePeriodMeta = (
      total: number,
      fromDate: Date,
      toDate: Date,
      overrideSettings?: IFormatNumberSettings,
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
    public getNetIncomeDateRange = (fromDate: Date, toDate: Date) => {
      // Mapping income/expense accounts ids.
      const incomeAccountsIds = this.getAccountsIdsByType(
        ACCOUNT_ROOT_TYPE.INCOME,
      );
      const expenseAccountsIds = this.getAccountsIdsByType(
        ACCOUNT_ROOT_TYPE.EXPENSE,
      );
      // Income closing balance.
      const incomeClosingBalance = accumSum(incomeAccountsIds, (id) =>
        this.netIncomeLedger
          .whereFromDate(fromDate)
          .whereToDate(toDate)
          .whereAccountId(id)
          .getClosingBalance(),
      );
      // Expense closing balance.
      const expenseClosingBalance = accumSum(expenseAccountsIds, (id) =>
        this.netIncomeLedger
          .whereToDate(toDate)
          .whereFromDate(fromDate)
          .whereAccountId(id)
          .getClosingBalance(),
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
    public getNetIncomeDatePeriod = (dateRange): ICashFlowDatePeriod => {
      const total = this.getNetIncomeDateRange(
        dateRange.fromDate,
        dateRange.toDate,
      );
      return this.getDatePeriodMeta(
        total,
        dateRange.fromDate,
        dateRange.toDate,
      );
    };

    /**
     * Retrieve the net income node between the given date ranges.
     * @param {Date} fromDate
     * @param {Date} toDate
     * @returns {ICashFlowDatePeriod[]}
     */
    public getNetIncomeDatePeriods = (
      _section: ICashFlowStatementNetIncomeSection,
    ): ICashFlowDatePeriod[] => {
      return this.dateRangeSet.map(this.getNetIncomeDatePeriod.bind(this));
    };

    /**
     * Writes periods property to net income section.
     * @param {ICashFlowStatementNetIncomeSection} section
     * @returns {ICashFlowStatementNetIncomeSection}
     */
    public assocPeriodsToNetIncomeNode = (
      section: ICashFlowStatementNetIncomeSection,
    ): ICashFlowStatementNetIncomeSection => {
      const incomeDatePeriods = this.getNetIncomeDatePeriods(section);
      return assoc('periods', incomeDatePeriods, section);
    };

    // Account nodes --------------------
    /**
     * Retrieve the account total between date range.
     * @param {ICashFlowStatementAccountMeta} node - Account node.
     * @param {Date} fromDate - From date.
     * @param {Date} toDate - To date.
     * @return {number}
     */
    public getAccountTotalDateRange = (
      node: ICashFlowStatementAccountMeta,
      fromDate: Date,
      toDate: Date,
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
     * @param {ICashFlowStatementAccountMeta} node -
     * @param {Date} fromDate - From date.
     * @param {Date} toDate - To date.
     * @return {ICashFlowDatePeriod}
     */
    public getAccountTotalDatePeriod = (
      node: ICashFlowStatementAccountMeta,
      fromDate: Date,
      toDate: Date,
    ): ICashFlowDatePeriod => {
      const total = this.getAccountTotalDateRange(node, fromDate, toDate);
      return this.getDatePeriodMeta(total, fromDate, toDate);
    };

    /**
     * Retrieve the accounts date periods nodes of the give account node.
     * @param {ICashFlowStatementAccountMeta} node -
     * @return {ICashFlowDatePeriod[]}
     */
    public getAccountDatePeriods = (
      node: ICashFlowStatementAccountMeta,
    ): ICashFlowDatePeriod[] => {
      return this.getNodeDatePeriods(
        node,
        this.getAccountTotalDatePeriod.bind(this),
      );
    };

    /**
     * Writes `periods` property to account node.
     * @param {ICashFlowStatementAccountMeta} node -
     * @return {ICashFlowStatementAccountMeta}
     */
    public assocPeriodsToAccountNode = (
      node: ICashFlowStatementAccountMeta,
    ): ICashFlowStatementAccountMeta => {
      const datePeriods = this.getAccountDatePeriods(node);
      return assoc('periods', datePeriods, node);
    };

    // Aggregate node -------------------------
    /**
     * Retrieve total of the given period index for node that has children nodes.
     * @return {number}
     */
    public getChildrenTotalPeriodByIndex = (node, index: number): number => {
      return sumBy(node.children, `periods[${index}].total.amount`);
    };

    /**
     * Retrieve date period meta of the given node index.
     * @param {ICashFlowStatementSection} node -
     * @param {number} index - Loop index.
     * @param {Date} fromDate - From date.
     * @param {Date} toDate - To date.
     */
    public getChildrenTotalPeriodMetaByIndex(
      node: ICashFlowStatementSection,
      index: number,
      fromDate: Date,
      toDate: Date,
    ) {
      const total = this.getChildrenTotalPeriodByIndex(node, index);
      return this.getDatePeriodTotalMeta(total, fromDate, toDate);
    }

    /**
     * Retrieve the date periods of aggregate node.
     * @param {ICashFlowStatementSection} node
     */
    public getAggregateNodeDatePeriods(node: ICashFlowStatementSection) {
      return this.dateRangeSet.map((dateRange, index) =>
        this.getChildrenTotalPeriodMetaByIndex(
          node,
          index,
          dateRange.fromDate,
          dateRange.toDate,
        ),
      );
    }

    /**
     * Writes `periods` property to aggregate section node.
     * @param {ICashFlowStatementSection} node -
     * @return {ICashFlowStatementSection}
     */
    public assocPeriodsToAggregateNode = (node): ICashFlowStatementSection => {
      const datePeriods = this.getAggregateNodeDatePeriods(node);
      return assoc('periods', datePeriods, node);
    };

    // Total equation node --------------------

    public sectionsMapToTotalPeriod = (
      mappedSections: { [key: number]: any },
      index,
    ) => {
      return mapValues(
        mappedSections,
        (node) => get(node, `periods[${index}].total.amount`) || 0,
      );
    };

    /**
     * Retrieve the date periods of the given total equation.
     * @param {ICashFlowStatementTotalSection}
     * @param {string} equation -
     * @return {ICashFlowDatePeriod[]}
     */
    public getTotalEquationDatePeriods = (
      node: ICashFlowStatementTotalSection,
      equation: string,
      nodesTable,
    ): ICashFlowDatePeriod[] => {
      return this.getNodeDatePeriods(node, (node, fromDate, toDate, index) => {
        const periodScope = this.sectionsMapToTotalPeriod(nodesTable, index);
        const total = this.evaluateEquation(equation, periodScope);

        return this.getDatePeriodTotalMeta(total, fromDate, toDate);
      });
    };

    /**
     * Associates the total periods of total equation to the ginve total node..
     * @param {ICashFlowStatementTotalSection} totalSection -
     * @return {ICashFlowStatementTotalSection}
     */
    public assocTotalEquationDatePeriods = (
      nodesTable: any,
      equation: string,
      node: ICashFlowStatementTotalSection,
    ): ICashFlowStatementTotalSection => {
      const datePeriods = this.getTotalEquationDatePeriods(
        node,
        equation,
        nodesTable,
      );

      return assoc('periods', datePeriods, node);
    };

    // Cash at beginning ----------------------

    /**
     * Retrieve the date preioods of the given node and accumulated function.
     * @param {} node
     * @param {}
     * @return {}
     */
    public getNodeDatePeriods = (node, callback) => {
      return this.dateRangeSet.map((dateRange, index) =>
        callback(node, dateRange.fromDate, dateRange.toDate, index),
      );
    };

    /**
     * Retrieve the account total between date range.
     * @param {ICashFlowStatementAccountMeta} node - Account node.
     * @param {Date} fromDate - From date.
     * @param {Date} toDate - To date.
     * @return {number}
     */
    public getBeginningCashAccountDateRange = (
      node: ICashFlowStatementAccountMeta,
      fromDate: Date,
      _toDate: Date,
    ) => {
      const cashToDate = this.beginningCashFrom(fromDate);

      return this.cashLedger
        .whereToDate(cashToDate)
        .whereAccountId(node.id)
        .getClosingBalance();
    };

    /**
     * Retrieve the beginning cash date period.
     * @param {ICashFlowStatementAccountMeta} node -
     * @param {Date} fromDate - From date.
     * @param {Date} toDate - To date.
     * @return {ICashFlowDatePeriod}
     */
    public getBeginningCashDatePeriod = (
      node: ICashFlowStatementAccountMeta,
      fromDate: Date,
      toDate: Date,
    ) => {
      const total = this.getBeginningCashAccountDateRange(
        node,
        fromDate,
        toDate,
      );
      return this.getDatePeriodTotalMeta(total, fromDate, toDate);
    };

    /**
     * Retrieve the beginning cash account periods.
     * @param {ICashFlowStatementAccountMeta} node
     * @return {ICashFlowDatePeriod[]}
     */
    public getBeginningCashAccountPeriods = (
      node: ICashFlowStatementAccountMeta,
    ): ICashFlowDatePeriod[] => {
      return this.getNodeDatePeriods(node, this.getBeginningCashDatePeriod);
    };

    /**
     * Writes `periods` property to cash at beginning date periods.
     * @param {ICashFlowStatementSection} section -
     * @return {ICashFlowStatementSection}
     */
    public assocCashAtBeginningDatePeriods = (
      node,
    ): ICashFlowStatementSection => {
      const datePeriods = this.getAggregateNodeDatePeriods(node);
      return assoc('periods', datePeriods, node);
    };

    /**
     * Associates `periods` propery to cash at beginning account node.
     * @param {ICashFlowStatementAccountMeta} node -
     * @return {ICashFlowStatementSection}
     */
    public assocCashAtBeginningAccountDatePeriods = (
      node,
    ): ICashFlowStatementSection => {
      const datePeriods = this.getBeginningCashAccountPeriods(node);
      return assoc('periods', datePeriods, node);
    };
  };
