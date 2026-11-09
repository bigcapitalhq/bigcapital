import { flow } from 'fp-ts/function';
import { assoc, ifElse, when } from '@/common/fp';
import { GConstructor } from '@/common/types/Constructor';
import {
  IProfitLossSheetNode,
  ProfitLossAggregateNodeId,
} from './ProfitLossSheet.types';
import { FinancialHorizTotals } from '../../common/FinancialHorizTotals';
import { FinancialSheet } from '../../common/FinancialSheet';
import { ProfitLossSheetQuery } from './ProfitLossSheetQuery';

export const ProfitLossSheetPercentage = <
  T extends GConstructor<FinancialSheet>,
>(
  Base: T,
) =>
  class extends flow(FinancialHorizTotals)(Base) {
    query: ProfitLossSheetQuery;

    protected mapNodesDeep: (nodes, callback) => any;
    protected findNodeById: (id, nodes) => any;
    protected isNodeTotal: (node) => boolean;

    /**
     * Assoc column of percentage attribute to the given node.
     * @param {IProfitLossSheetNode} netIncomeNode -
     * @param {IProfitLossSheetNode} node -
     * @return {IProfitLossSheetNode}
     */
    private assocColumnPercentage =
      (propertyPath: string, parentNode: IProfitLossSheetNode) =>
      (node: IProfitLossSheetNode) => {
        const percentage = this.getPercentageBasis(
          parentNode.total.amount,
          node.total.amount,
        );
        return assoc(
          propertyPath,
          this.getPercentageAmountMeta(percentage),
          node,
        );
      };

    /**
     * Assoc column of percentage attribute to the given node.
     * @param {IProfitLossSheetNode} netIncomeNode -
     * @param {IProfitLossSheetNode} node -
     * @return {IProfitLossSheetNode}
     */
    private assocColumnTotalPercentage =
      (propertyPath: string, parentNode: IProfitLossSheetNode) =>
      (node: IProfitLossSheetNode) => {
        const percentage = this.getPercentageBasis(
          parentNode.total.amount,
          node.total.amount,
        );
        return assoc(
          propertyPath,
          this.getPercentageTotalAmountMeta(percentage),
          node,
        );
      };

    /**
     * Compose percentage of columns.
     * @param   {IProfitLossSheetNode[]} nodes
     * @returns {IProfitLossSheetNode[]}
     */
    private columnPercentageCompose = (
      nodes: IProfitLossSheetNode[],
    ): IProfitLossSheetNode[] => {
      const netIncomeNode = this.findNodeById(
        ProfitLossAggregateNodeId.NET_INCOME,
        nodes,
      );
      return this.mapNodesDeep(
        nodes,
        this.columnPercentageMapper(netIncomeNode),
      );
    };

    /**
     * Compose percentage of income.
     * @param   {IProfitLossSheetNode[]} nodes
     * @returns {IProfitLossSheetNode[]}
     */
    private incomePercetageCompose = (
      nodes: IProfitLossSheetNode[],
    ): IProfitLossSheetNode[] => {
      const incomeNode = this.findNodeById(
        ProfitLossAggregateNodeId.INCOME,
        nodes,
      );
      return this.mapNodesDeep(nodes, this.incomePercentageMapper(incomeNode));
    };

    /**
     *
     * @param {IProfitLossSheetNode[]} nodes
     * @returns {IProfitLossSheetNode[]}
     */
    private rowPercentageCompose = (
      nodes: IProfitLossSheetNode[],
    ): IProfitLossSheetNode[] => {
      return this.mapNodesDeep(nodes, this.rowPercentageMap);
    };

    /**
     *
     * @param  {IProfitLossSheetNode} netIncomeNode -
     * @param  {IProfitLossSheetNode} node -
     * @return {IProfitLossSheetNode}
     */
    private columnPercentageMapper =
      (netIncomeNode: IProfitLossSheetNode) => (node: IProfitLossSheetNode) => {
        const path = 'percentageColumn';

        return flow(
          ifElse(
            this.isNodeTotal,
            this.assocColumnTotalPercentage(path, netIncomeNode),
            this.assocColumnPercentage(path, netIncomeNode),
          ),
          when(
            this.isNodeHasHorizTotals,
            this.assocColumnPercentageHorizTotals(netIncomeNode),
          ),
        )(node);
      };

    /**
     *
     * @param   {IProfitLossSheetNode} node
     * @returns {IProfitLossSheetNode}
     */
    private rowPercentageMap = (node: IProfitLossSheetNode) => {
      const path = 'percentageRow';

      return flow(
        ifElse(
          this.isNodeTotal,
          this.assocColumnTotalPercentage(path, node),
          this.assocColumnPercentage(path, node),
        ),
        when(this.isNodeHasHorizTotals, this.assocRowPercentageHorizTotals),
      )(node);
    };

    /**
     *
     * @param   {IProfitLossSheetNode} incomeNode -
     * @param   {IProfitLossSheetNode} node -
     * @returns {IProfitLossSheetNode}
     */
    private incomePercentageMapper =
      (incomeNode: IProfitLossSheetNode) => (node: IProfitLossSheetNode) => {
        const path = 'percentageIncome';

        return flow(
          ifElse(
            this.isNodeTotal,
            this.assocColumnTotalPercentage(path, incomeNode),
            this.assocColumnPercentage(path, incomeNode),
          ),
          when(
            this.isNodeHasHorizTotals,
            this.assocIncomePercentageHorizTotals(incomeNode),
          ),
        )(node);
      };

    /**
     *
     * @param {IProfitLossSheetNode} expenseNode -
     * @param {IProfitLossSheetNode} node -
     */
    private expensePercentageMapper =
      (expenseNode: IProfitLossSheetNode) => (node: IProfitLossSheetNode) => {
        const path = 'percentageExpense';

        return flow(
          ifElse(
            this.isNodeTotal,
            this.assocColumnTotalPercentage(path, expenseNode),
            this.assocColumnPercentage(path, expenseNode),
          ),
          when(
            this.isNodeHasHorizTotals,
            this.assocExpensePercentageHorizTotals(expenseNode),
          ),
        )(node);
      };

    /**
     * Compose percentage of expense.
     * @param   {IProfitLossSheetNode[]} nodes
     * @returns {IProfitLossSheetNode[]}
     */
    private expensesPercentageCompose = (
      nodes: IProfitLossSheetNode[],
    ): IProfitLossSheetNode[] => {
      const expenseNode = this.findNodeById(
        ProfitLossAggregateNodeId.EXPENSES,
        nodes,
      );
      return this.mapNodesDeep(
        nodes,
        this.expensePercentageMapper(expenseNode),
      );
    };

    /**
     * Compose percentage attributes.
     * @param   {IProfitLossSheetNode[]} nodes
     * @returns {IProfitLossSheetNode[]}
     */
    protected reportColumnsPerentageCompose = (
      nodes: IProfitLossSheetNode[],
    ): IProfitLossSheetNode[] => {
      return flow(
        when(this.query.isRowPercentage, this.rowPercentageCompose),
        when(this.query.isExpensesPercentage, this.expensesPercentageCompose),
        when(this.query.isColumnPercentage, this.columnPercentageCompose),
        when(this.query.isIncomePercentage, this.incomePercetageCompose),
      )(nodes);
    };

    /**
     *
     * @param   {} nodes
     * @returns {}
     */
    protected reportRowsPercentageCompose = (nodes) => {
      return nodes;
    };

    // ----------------------------------
    // # Horizontal Nodes
    // ----------------------------------
    /**
     * Assoc incomer percentage to horizontal totals nodes.
     * @param   {IProfitLossSheetNode} incomeNode -
     * @param   {IProfitLossSheetNode} node -
     * @returns {IProfitLossSheetNode}
     */
    private assocIncomePercentageHorizTotals =
      (incomeNode: IProfitLossSheetNode) => (node: IProfitLossSheetNode) => {
        const horTotalsWithIncomePerc = this.assocPercentageHorizTotals(
          'percentageIncome',
          incomeNode,
          node,
        );
        return assoc('horizontalTotals', horTotalsWithIncomePerc, node);
      };

    /**
     * Assoc expense percentage to horizontal totals nodes.
     * @param   {IProfitLossSheetNode} expenseNode -
     * @param   {IProfitLossSheetNode} node -
     * @returns {IProfitLossSheetNode}
     */
    private assocExpensePercentageHorizTotals =
      (expenseNode: IProfitLossSheetNode) => (node: IProfitLossSheetNode) => {
        const horTotalsWithExpensePerc = this.assocPercentageHorizTotals(
          'percentageExpense',
          expenseNode,
          node,
        );
        return assoc('horizontalTotals', horTotalsWithExpensePerc, node);
      };

    /**
     * Assoc net income percentage to horizontal totals nodes.
     * @param   {IProfitLossSheetNode} expenseNode -
     * @param   {IProfitLossSheetNode} node -
     * @returns {IProfitLossSheetNode}
     */
    private assocColumnPercentageHorizTotals =
      (netIncomeNode: IProfitLossSheetNode) => (node: IProfitLossSheetNode) => {
        const horTotalsWithExpensePerc = this.assocPercentageHorizTotals(
          'percentageColumn',
          netIncomeNode,
          node,
        );
        return assoc('horizontalTotals', horTotalsWithExpensePerc, node);
      };

    /**
     *
     */
    private assocRowPercentageHorizTotals = (node) => {
      const horTotalsWithExpensePerc = this.assocHorizontalPercentageTotals(
        'percentageRow',
        node,
      );
      return assoc('horizontalTotals', horTotalsWithExpensePerc, node);
    };
  };
