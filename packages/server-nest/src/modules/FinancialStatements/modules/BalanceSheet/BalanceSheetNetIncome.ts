import * as R from 'ramda';
import {
  BALANCE_SHEET_SCHEMA_NODE_TYPE,
  IBalanceSheetDataNode,
  IBalanceSheetNetIncomeNode,
  IBalanceSheetSchemaNetIncomeNode,
  IBalanceSheetSchemaNode,
  IBalanceSheetTotalPeriod,
} from './BalanceSheet.types';
import { BalanceSheetComparsionPreviousYear } from './BalanceSheetComparsionPreviousYear';
import { BalanceSheetComparsionPreviousPeriod } from './BalanceSheetComparsionPreviousPeriod';
import { FinancialPreviousPeriod } from '../../common/FinancialPreviousPeriod';
import { FinancialHorizTotals } from '../../common/FinancialHorizTotals';
import { BalanceSheetRepository } from './BalanceSheetRepository';
import { BalanceSheetQuery } from './BalanceSheetQuery';
import { BalanceSheetNetIncomePP } from './BalanceSheetNetIncomePP';
import { BalanceSheetNetIncomePY } from './BalanceSheetNetIncomePY';
import { FinancialSheet } from '../../common/FinancialSheet';
import { GConstructor } from '@/common/types/Constructor';

export const BalanceSheetNetIncome = <T extends GConstructor<FinancialSheet>>(
  Base: T,
) =>
  class extends R.pipe(
    BalanceSheetNetIncomePP,
    BalanceSheetNetIncomePY,
    BalanceSheetComparsionPreviousYear,
    BalanceSheetComparsionPreviousPeriod,
    FinancialPreviousPeriod,
    FinancialHorizTotals,
  )(Base) {
    public repository: BalanceSheetRepository;
    public query: BalanceSheetQuery;

    /**
     * Retrieves the closing balance of income accounts.
     * @returns {number}
     */
    public getIncomeTotal = () => {
      const closeingBalance = this.repository.incomeLedger.getClosingBalance();
      return closeingBalance;
    };

    /**
     * Retrieves the closing balance of expenses accounts.
     * @returns {number}
     */
    public getExpensesTotal = () => {
      const closingBalance = this.repository.expensesLedger.getClosingBalance();
      return closingBalance;
    };

    /**
     * Retrieves the total net income.
     * @returns {number}
     */
    public getNetIncomeTotal = () => {
      const income = this.getIncomeTotal();
      const expenses = this.getExpensesTotal();

      return income - expenses;
    };

    /**
     * Maps the aggregate schema node type.
     * @param {IBalanceSheetSchemaNetIncomeNode} node - Schema node.
     * @return {IBalanceSheetAggregateNode}
     */
    public schemaNetIncomeNodeMapper = (
      node: IBalanceSheetSchemaNetIncomeNode,
    ): IBalanceSheetNetIncomeNode => {
      const total = this.getNetIncomeTotal();

      return {
        id: node.id,
        name: this.i18n.__(node.name),
        nodeType: BALANCE_SHEET_SCHEMA_NODE_TYPE.NET_INCOME,
        total: this.getTotalAmountMeta(total),
      };
    };

    /**
     * Mapps the net income shcema node to report node.
     * @param {IBalanceSheetSchemaNetIncomeNode} node
     * @returns {IBalanceSheetNetIncomeNode}
     */
    public schemaNetIncomeNodeCompose = (
      node: IBalanceSheetSchemaNetIncomeNode,
    ): IBalanceSheetNetIncomeNode => {
      return R.compose(
        R.when(
          this.query.isPreviousYearActive,
          this.previousYearNetIncomeNodeCompose,
        ),
        R.when(
          this.query.isPreviousPeriodActive,
          this.previousPeriodNetIncomeNodeCompose,
        ),
        R.when(
          this.query.isDatePeriodsColumnsType,
          this.assocNetIncomeDatePeriodsNode,
        ),
        this.schemaNetIncomeNodeMapper,
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
    public getIncomeDatePeriodTotal = (toDate: Date): number => {
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
    public getExpensesDatePeriodTotal = (toDate: Date): number => {
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
    public getNetIncomeDatePeriodTotal = (toDate: Date): number => {
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
    public getNetIncomeDatePeriodNode = (
      node: IBalanceSheetNetIncomeNode,
      fromDate: Date,
      toDate: Date,
    ): IBalanceSheetTotalPeriod => {
      const periodTotal = this.getNetIncomeDatePeriodTotal(toDate);

      return this.getDatePeriodTotalMeta(periodTotal, fromDate, toDate);
    };

    /**
     * Retrieve total date periods of the given net income node.
     * @param {IBalanceSheetNetIncomeNode} node
     * @returns {IBalanceSheetNetIncomeNode}
     */
    public getNetIncomeDatePeriodsNode = (
      node: IBalanceSheetNetIncomeNode,
    ): IBalanceSheetTotalPeriod[] => {
      return this.getReportNodeDatePeriods(
        node,
        this.getNetIncomeDatePeriodNode,
      );
    };

    /**
     * Assoc total date periods to net income node.
     * @param {IBalanceSheetNetIncomeNode} node
     * @returns {IBalanceSheetNetIncomeNode}
     */
    public assocNetIncomeDatePeriodsNode = (
      node: IBalanceSheetNetIncomeNode,
    ): IBalanceSheetNetIncomeNode => {
      const datePeriods = this.getNetIncomeDatePeriodsNode(node);

      return R.assoc('horizontalTotals', datePeriods, node);
    };

    // -----------------------------
    // - Net Income Nodes Praser
    // -----------------------------
    /**
     * Mappes the given report schema node.
     * @param  {IBalanceSheetSchemaNode} node - Schema node.
     * @return {IBalanceSheetDataNode}
     */
    public reportNetIncomeNodeSchemaParser = (
      schemaNode: IBalanceSheetSchemaNode,
    ): IBalanceSheetDataNode => {
      return R.compose(
        R.when(
          this.isSchemaNodeType(BALANCE_SHEET_SCHEMA_NODE_TYPE.NET_INCOME),
          this.schemaNetIncomeNodeCompose,
        ),
      )(schemaNode);
    };

    /**
     * Parses the report net income schema nodes.
     * @param {(IBalanceSheetSchemaNode | IBalanceSheetDataNode)[]} nodes -
     * @return {IBalanceSheetDataNode[]}
     */
    public netIncomeSchemaParser = (
      nodes: (IBalanceSheetSchemaNode | IBalanceSheetDataNode)[],
    ): IBalanceSheetDataNode[] => {
      return this.mapNodesDeep(nodes, this.reportNetIncomeNodeSchemaParser);
    };
  };
