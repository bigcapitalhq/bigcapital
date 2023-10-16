import * as R from 'ramda';
import { sumBy, isEmpty } from 'lodash';
import {
  BALANCE_SHEET_SCHEMA_NODE_TYPE,
  IBalanceSheetAccountNode,
  IBalanceSheetAggregateNode,
  IBalanceSheetSchemaAggregateNode,
  IBalanceSheetTotalPeriod,
} from '@/interfaces';
import { BalanceSheetComparsionPreviousYear } from './BalanceSheetComparsionPreviousYear';
import { BalanceSheetComparsionPreviousPeriod } from './BalanceSheetComparsionPreviousPeriod';
import { FinancialPreviousPeriod } from '../FinancialPreviousPeriod';
import { FinancialHorizTotals } from '../FinancialHorizTotals';
import BalanceSheetRepository from './BalanceSheetRepository';
import { ACCOUNT_TYPE } from '@/data/AccountTypes';

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
     * @param  {IBalanceSheetSchemaAggregateNode} node - Schema node.
     * @return {IBalanceSheetAggregateNode}
     */
    protected schemaNetIncomeNodeMapper = (
      node: IBalanceSheetSchemaAggregateNode
    ): IBalanceSheetAggregateNode => {
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
     * @param {IBalanceSheetSchemaAggregateNode} node
     * @returns
     */
    protected schemaNetIncomeNodeCompose = (
      node: IBalanceSheetSchemaAggregateNode
    ) => {
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
      node: IBalanceSheetAccountNode
    ): IBalanceSheetAccountNode => {
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
     * @param   {IBalanceSheetAccountNode} node
     * @returns {IBalanceSheetAccountNode}
     */
    protected previousPeriodNetIncomeNodeCompose = (
      node: IBalanceSheetAccountNode
    ): IBalanceSheetAccountNode => {
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
     * Retrieve the given net income date period total.
     * @param {number} accountId
     * @param {Date} toDate
     * @returns {number}
     */
    private getNetIncomeDatePeriodTotal = (
      accountId: number,
      toDate: Date
    ): number => {
      const periodTotalBetween = this.repository.periodsAccountsLedger
        .whereAccountId(accountId)
        .whereToDate(toDate)
        .getClosingBalance();

      const periodOpening = this.repository.periodsOpeningAccountLedger
        .whereAccountId(accountId)
        .getClosingBalance();

      return periodOpening + periodTotalBetween;
    };

    /**
     *
     * @param   {IBalanceSheetAccountNode} node
     * @param   {Date} fromDate
     * @param   {Date} toDate
     * @returns {IBalanceSheetAccountNode}
     */
    private getNetIncomeDatePeriodNode = (
      node: IBalanceSheetAccountNode,
      fromDate: Date,
      toDate: Date
    ): IBalanceSheetTotalPeriod => {
      const periodTotal = this.getNetIncomeDatePeriodTotal(node.id, toDate);

      return this.getDatePeriodTotalMeta(periodTotal, fromDate, toDate);
    };

    /**
     * Retrieve total date periods of the given net income node.
     * @param   {IBalanceSheetAccountNode} node
     * @returns {IBalanceSheetAccountNode}
     */
    private getNetIncomeDatePeriodsNode = (
      node: IBalanceSheetAccountNode
    ): IBalanceSheetTotalPeriod[] => {
      return this.getReportNodeDatePeriods(
        node,
        this.getNetIncomeDatePeriodNode
      );
    };

    /**
     * Assoc total date periods to net income node.
     * @param   {IBalanceSheetAccountNode} node
     * @returns {IBalanceSheetAccountNode}
     */
    public assocNetIncomeDatePeriodsNode = (
      node: IBalanceSheetAccountNode
    ): IBalanceSheetAccountNode => {
      const datePeriods = this.getNetIncomeDatePeriodsNode(node);

      return R.assoc('horizontalTotals', datePeriods, node);
    };
  };
