import * as R from 'ramda';
import {
  IBalanceSheetNetIncomeNode,
  IBalanceSheetTotalPeriod,
} from '@/interfaces';
import { BalanceSheetComparsionPreviousYear } from './BalanceSheetComparsionPreviousYear';
import { BalanceSheetComparsionPreviousPeriod } from './BalanceSheetComparsionPreviousPeriod';
import { FinancialPreviousPeriod } from '../FinancialPreviousPeriod';
import { FinancialHorizTotals } from '../FinancialHorizTotals';
import BalanceSheetRepository from './BalanceSheetRepository';
import { BalanceSheetQuery } from './BalanceSheetQuery';
import { BalanceSheetNetIncomePP } from './BalanceSheetNetIncomePP';
import { BalanceSheetNetIncomePY } from './BalanceSheetNetIncomePY';

export const BalanceSheetNetIncomeDatePeriods = (Base: any) =>
  class extends R.compose(
    BalanceSheetNetIncomePP,
    BalanceSheetNetIncomePY,
    BalanceSheetComparsionPreviousYear,
    BalanceSheetComparsionPreviousPeriod,
    FinancialPreviousPeriod,
    FinancialHorizTotals
  )(Base) {
    private repository: BalanceSheetRepository;
    private query: BalanceSheetQuery;

    // --------------------------------
    // # Date Periods
    // --------------------------------
    /**
     * Retreives total income of the given date period.
     * @param {number} accountId -
     * @param {Date} toDate -
     * @returns {number}
     */
    private getIncomeDatePeriodTotal = (toDate: Date): number => {
      const periodTotalBetween = this.repository.incomePeriodsAccountsLedger
        .whereToDate(toDate)
        .getClosingBalance();

      const periodOpening =
        this.repository.incomePeriodsOpeningAccountsLedger.getClosingBalance();

      return periodOpening + periodTotalBetween;
    };

    /**
     * Retrieves total expense of the given date period.
     * @param {number} accountId -
     * @param {Date} toDate -
     * @returns {number}
     */
    private getExpensesDatePeriodTotal = (toDate: Date): number => {
      const periodTotalBetween = this.repository.expensesPeriodsAccountsLedger
        .whereToDate(toDate)
        .getClosingBalance();

      const periodOpening =
        this.repository.expensesOpeningAccountLedger.getClosingBalance();

      return periodOpening + periodTotalBetween;
    };

    /**
     * Retrieve the given net income date period total.
     * @param {number} accountId
     * @param {Date} toDate
     * @returns {number}
     */
    private getNetIncomeDatePeriodTotal = (toDate: Date): number => {
      const income = this.getIncomeDatePeriodTotal(toDate);
      const expense = this.getExpensesDatePeriodTotal(toDate);

      return income - expense;
    };

    /**
     * Retrieves the net income date period node.
     * @param {IBalanceSheetNetIncomeNode} node
     * @param {Date} fromDate
     * @param {Date} toDate
     * @returns {IBalanceSheetNetIncomeNode}
     */
    private getNetIncomeDatePeriodNode = (
      node: IBalanceSheetNetIncomeNode,
      fromDate: Date,
      toDate: Date
    ): IBalanceSheetTotalPeriod => {
      const periodTotal = this.getNetIncomeDatePeriodTotal(toDate);

      return this.getDatePeriodTotalMeta(periodTotal, fromDate, toDate);
    };

    /**
     * Retrieve total date periods of the given net income node.
     * @param {IBalanceSheetNetIncomeNode} node
     * @returns {IBalanceSheetNetIncomeNode}
     */
    private getNetIncomeDatePeriodsNode = (
      node: IBalanceSheetNetIncomeNode
    ): IBalanceSheetTotalPeriod[] => {
      return this.getReportNodeDatePeriods(
        node,
        this.getNetIncomeDatePeriodNode
      );
    };

    /**
     * Assoc total date periods to net income node.
     * @param {IBalanceSheetNetIncomeNode} node
     * @returns {IBalanceSheetNetIncomeNode}
     */
    public assocNetIncomeDatePeriodsNode = (
      node: IBalanceSheetNetIncomeNode
    ): IBalanceSheetNetIncomeNode => {
      const datePeriods = this.getNetIncomeDatePeriodsNode(node);

      return R.assoc('horizontalTotals', datePeriods, node);
    };
  };
