import * as R from 'ramda';
import { sumBy, isEmpty } from 'lodash';
import {
  BALANCE_SHEET_SCHEMA_NODE_TYPE,
  IBalanceSheetAccountNode,
  IBalanceSheetNetIncomeNode,
  IBalanceSheetSchemaNetIncomeNode,
  IBalanceSheetTotalPeriod,
} from '@/interfaces';
import { BalanceSheetComparsionPreviousYear } from './BalanceSheetComparsionPreviousYear';
import { BalanceSheetComparsionPreviousPeriod } from './BalanceSheetComparsionPreviousPeriod';
import { FinancialPreviousPeriod } from '../FinancialPreviousPeriod';
import { FinancialHorizTotals } from '../FinancialHorizTotals';
import BalanceSheetRepository from './BalanceSheetRepository';

export const BalanceSheetNetIncome = (Base: any) =>
  class extends R.compose(
    BalanceSheetComparsionPreviousYear,
    BalanceSheetComparsionPreviousPeriod,
    FinancialPreviousPeriod,
    FinancialHorizTotals
  )(Base) {
    private repository: BalanceSheetRepository;

    /**
     * Retrieves the closing balance of income accounts.
     * @returns {number}
     */
    private getIncomeTotal = () => {
      const closeingBalance = this.repository.incomeLedger.getClosingBalance();

      return closeingBalance;
    };

    /**
     * Retrieves the closing balance of expenses accounts.
     * @returns {number}
     */
    private getExpensesTotal = () => {
      const closingBalance = this.repository.expensesLedger.getClosingBalance();

      return closingBalance;
    };

    /**
     * Retrieves the total net income.
     * @returns {number}
     */
    protected getNetIncomeTotal = () => {
      const income = this.getIncomeTotal();
      const expenses = this.getExpensesTotal();

      return income - expenses;
    };

    /**
     * Mappes the aggregate schema node type.
     * @param  {IBalanceSheetSchemaNetIncomeNode} node - Schema node.
     * @return {IBalanceSheetAggregateNode}
     */
    protected schemaNetIncomeNodeMapper = (
      node: IBalanceSheetSchemaNetIncomeNode
    ): IBalanceSheetNetIncomeNode => {
      const total = this.getNetIncomeTotal();

      return {
        name: this.i18n.__(node.name),
        id: node.id,
        nodeType: BALANCE_SHEET_SCHEMA_NODE_TYPE.NET_INCOME,
        total: this.getTotalAmountMeta(total),
        children: node.children,
      };
    };

    /**
     * Mapps the net income shcema node to report node.
     * @param {IBalanceSheetSchemaNetIncomeNode} node
     * @returns {IBalanceSheetNetIncomeNode}
     */
    protected schemaNetIncomeNodeCompose = (
      node: IBalanceSheetSchemaNetIncomeNode
    ): IBalanceSheetNetIncomeNode => {
      return R.compose(
        R.when(
          this.query.isPreviousYearActive,
          this.previousYearNetIncomeNodeCompose
        ),
        R.when(
          this.query.isPreviousPeriodActive,
          this.previousPeriodNetIncomeNodeCompose
        ),
        R.when(
          this.query.isDatePeriodsColumnsType,
          this.assocNetIncomeDatePeriodsNode
        ),
        this.schemaNetIncomeNodeMapper
      )(node);
    };

    // ------------------------------
    // # Previous Year (PY)
    // ------------------------------
    /**
     * Assoc previous year on aggregate node.
     * @param   {IBalanceSheetAccountNode} node
     * @returns {IBalanceSheetAccountNode}
     */
    protected assocPreviousYearAggregateNode = (
      node: IBalanceSheetAccountNode
    ): IBalanceSheetAccountNode => {
      const total = sumBy(node.children, 'previousYear.amount');

      return R.assoc('previousYear', this.getTotalAmountMeta(total), node);
    };

    /**
     * Assoc previous year attributes to aggregate node.
     * @param   {IBalanceSheetAccountNode} node
     * @returns {IBalanceSheetAccountNode}
     */
    protected previousYearNetIncomeNodeCompose = (
      node: IBalanceSheetNetIncomeNode
    ): IBalanceSheetNetIncomeNode => {
      return R.compose(
        R.when(
          this.query.isPreviousYearPercentageActive,
          this.assocPreviousYearTotalPercentageNode
        ),
        R.when(
          this.query.isPreviousYearChangeActive,
          this.assocPreviousYearTotalChangeNode
        ),
        R.when(
          this.isNodeHasHorizontalTotals,
          this.assocPreviousYearAggregateHorizNode
        ),
        this.assocPreviousYearAggregateNode
      )(node);
    };

    // -------------------------------
    // # Previous Period (PP)
    // -------------------------------
    /**
     * Previous period account node composer.
     * @param {IBalanceSheetNetIncomeNode} node
     * @returns {IBalanceSheetNetIncomeNode}
     */
    protected previousPeriodNetIncomeNodeCompose = (
      node: IBalanceSheetNetIncomeNode
    ): IBalanceSheetNetIncomeNode => {
      return R.compose(
        // R.when(
        //   this.isNodeHasHorizTotals,
        //   this.assocPreivousPeriodAccountHorizNodeComposer
        // ),
        R.when(
          this.query.isPreviousPeriodPercentageActive,
          this.assocPreviousPeriodPercentageNode
        ),
        R.when(
          this.query.isPreviousPeriodChangeActive,
          this.assocPreviousPeriodChangeNode
        ),
        R.when(
          this.query.isPreviousPeriodActive,
          this.assocPreviousPeriodAccountNode
        )
      )(node);
    };

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
