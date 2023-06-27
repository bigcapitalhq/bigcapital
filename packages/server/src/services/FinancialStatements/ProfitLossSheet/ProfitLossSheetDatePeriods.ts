import * as R from 'ramda';
import { sumBy } from 'lodash';
import { FinancialDatePeriods } from '../FinancialDatePeriods';
import {
  IDateRange,
  IProfitLossHorizontalDatePeriodNode,
  IProfitLossSheetAccountNode,
  IProfitLossSheetAccountsNode,
  IProfitLossSheetCommonNode,
  IProfitLossSheetNode,
} from '@/interfaces';

export const ProfitLossSheetDatePeriods = (Base) =>
  class extends R.compose(FinancialDatePeriods)(Base) {
    /**
     * Retrieves the date periods based on the report query.
     * @returns {IDateRange[]}
     */
    get datePeriods(): IDateRange[] {
      return this.getDateRanges(
        this.query.fromDate,
        this.query.toDate,
        this.query.displayColumnsBy
      );
    }

    /**
     * Retrieves the date periods of the given node based on the report query.
     * @param   {IProfitLossSheetCommonNode} node
     * @param   {Function} callback
     * @returns {}
     */
    protected getReportNodeDatePeriods = (
      node: IProfitLossSheetCommonNode,
      callback: (
        node: IProfitLossSheetCommonNode,
        fromDate: Date,
        toDate: Date,
        index: number
      ) => any
    ) => {
      return this.getNodeDatePeriods(
        this.query.fromDate,
        this.query.toDate,
        this.query.displayColumnsBy,
        node,
        callback
      );
    };

    // --------------------------
    // # Account Nodes.
    // --------------------------
    /**
     * Retrieve account node date period total.
     * @param   {IProfitLossSheetAccount} node
     * @param   {Date} fromDate
     * @param   {Date} toDate
     * @returns {}
     */
    private getAccountNodeDatePeriodTotal = (
      node: IProfitLossSheetAccountNode,
      fromDate: Date,
      toDate: Date
    ) => {
      const periodTotal = this.repository.periodsAccountsLedger
        .whereAccountId(node.id)
        .whereFromDate(fromDate)
        .whereToDate(toDate)
        .getClosingBalance();

      return this.getDatePeriodTotalMeta(periodTotal, fromDate, toDate);
    };

    /**
     * Retrieve account node date period.
     * @param   {IProfitLossSheetAccountNode} node
     * @returns {IProfitLossSheetAccountNode}
     */
    public getAccountNodeDatePeriod = (node: IProfitLossSheetAccountNode) => {
      return this.getReportNodeDatePeriods(
        node,
        this.getAccountNodeDatePeriodTotal
      );
    };

    /**
     * Account date periods to the given account node.
     * @param   {IProfitLossSheetAccountNode} node
     * @returns {IProfitLossSheetAccountNode}
     */
    public assocAccountNodeDatePeriod = (
      node: IProfitLossSheetAccountNode
    ): IProfitLossSheetAccountNode => {
      const datePeriods = this.getAccountNodeDatePeriod(node);

      return R.assoc('horizontalTotals', datePeriods, node);
    };

    // --------------------------
    // # Aggregate nodes.
    // --------------------------
    /**
     * Retrieves summation of the given aggregate node children totals.
     * @param   {IProfitLossSheetAccountsNode} node
     * @param   {number} index
     * @returns {number}
     */
    private getAggregateDatePeriodIndexTotal = (
      node: IProfitLossSheetAccountsNode,
      index: number
    ): number => {
      return sumBy(node.children, `horizontalTotals[${index}].total.amount`);
    };

    /**
     *
     * @param    {IProfitLossSheetAccount} node
     * @param    {Date} fromDate
     * @param    {Date} toDate
     * @param    {number} index
     * @returns  {IProfitLossSheetAccount}
     */
    private getAggregateNodeDatePeriodTotal = R.curry(
      (
        node: IProfitLossSheetAccountsNode,
        fromDate: Date,
        toDate: Date,
        index: number
      ): IProfitLossHorizontalDatePeriodNode => {
        const periodTotal = this.getAggregateDatePeriodIndexTotal(node, index);

        return this.getDatePeriodTotalMeta(periodTotal, fromDate, toDate);
      }
    );

    /**
     * Retrieves aggregate horizontal date periods.
     * @param   {IProfitLossSheetAccountsNode} node
     * @returns {IProfitLossSheetAccountsNode}
     */
    private getAggregateNodeDatePeriod = (
      node: IProfitLossSheetAccountsNode
    ): IProfitLossHorizontalDatePeriodNode[] => {
      return this.getReportNodeDatePeriods(
        node,
        this.getAggregateNodeDatePeriodTotal
      );
    };

    /**
     * Assoc horizontal date periods to aggregate node.
     * @param   {IProfitLossSheetAccountsNode} node
     * @returns {IProfitLossSheetAccountsNode}
     */
    protected assocAggregateDatePeriod = (
      node: IProfitLossSheetAccountsNode
    ): IProfitLossSheetAccountsNode => {
      const datePeriods = this.getAggregateNodeDatePeriod(node);

      return R.assoc('horizontalTotals', datePeriods, node);
    };

    // --------------------------
    // # Equation nodes.
    // --------------------------
    /**
     * Retrieves equation date period node.
     * @param   {IProfitLossSheetNode[]} accNodes
     * @param   {IProfitLossSheetNode} node
     * @param   {Date} fromDate
     * @param   {Date} toDate
     * @param   {number} index
     * @returns {IProfitLossHorizontalDatePeriodNode}
     */
    private getEquationNodeDatePeriod = R.curry(
      (
        accNodes: IProfitLossSheetNode[],
        equation: string,
        node: IProfitLossSheetNode,
        fromDate: Date,
        toDate: Date,
        index: number
      ): IProfitLossHorizontalDatePeriodNode => {
        const tableNodes = this.getNodesTableForEvaluating(
          `horizontalTotals[${index}].total.amount`,
          accNodes
        );
        // Evaluate the given equation.
        const total = this.evaluateEquation(equation, tableNodes);

        return this.getDatePeriodTotalMeta(total, fromDate, toDate);
      }
    );

    /**
     * Retrieves the equation node date periods.
     * @param   {IProfitLossSheetNode[]} node
     * @param   {string} equation
     * @param   {IProfitLossSheetNode} node
     * @returns {IProfitLossHorizontalDatePeriodNode[]}
     */
    private getEquationNodeDatePeriods = R.curry(
      (
        accNodes: IProfitLossSheetNode[],
        equation: string,
        node: IProfitLossSheetNode
      ): IProfitLossHorizontalDatePeriodNode[] => {
        return this.getReportNodeDatePeriods(
          node,
          this.getEquationNodeDatePeriod(accNodes, equation)
        );
      }
    );

    /**
     * Assoc equation node date period.
     * @param   {IProfitLossSheetNode[]}
     * @param   {IProfitLossSheetNode} node
     * @returns {IProfitLossSheetNode}
     */
    protected assocEquationNodeDatePeriod = R.curry(
      (
        accNodes: IProfitLossSheetNode[],
        equation: string,
        node: IProfitLossSheetNode
      ): IProfitLossSheetNode => {
        const periods = this.getEquationNodeDatePeriods(
          accNodes,
          equation,
          node
        );
        return R.assoc('horizontalTotals', periods, node);
      }
    );
  };
