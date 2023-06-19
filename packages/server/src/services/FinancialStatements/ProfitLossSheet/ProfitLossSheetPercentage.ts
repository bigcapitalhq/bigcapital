import * as R from 'ramda';
import {
  IProfitLossSheetNode,
  IProfitLossSheetTotal,
  ProfitLossAggregateNodeId,
} from '@/interfaces';
import { FinancialHorizTotals } from '../FinancialHorizTotals';

export const ProfitLossSheetPercentage = (Base) =>
  class extends R.compose(FinancialHorizTotals)(Base) {
    /**
     * Assoc column of percentage attribute to the given node.
     * @param  {IProfitLossSheetNode} netIncomeNode -
     * @param  {IProfitLossSheetNode} node -
     * @return {IProfitLossSheetNode}
     */
    private assocColumnPercentage = R.curry(
      (
        propertyPath: string,
        parentNode: IProfitLossSheetNode,
        node: IProfitLossSheetNode
      ) => {
        const percentage = this.getPercentageBasis(
          parentNode.total.amount,
          node.total.amount
        );
        return R.assoc(
          propertyPath,
          this.getPercentageAmountMeta(percentage),
          node
        );
      }
    );

    /**
     * Assoc column of percentage attribute to the given node.
     * @param  {IProfitLossSheetNode} netIncomeNode -
     * @param  {IProfitLossSheetNode} node -
     * @return {IProfitLossSheetNode}
     */
    private assocColumnTotalPercentage = R.curry(
      (
        propertyPath: string,
        parentNode: IProfitLossSheetNode,
        node: IProfitLossSheetNode
      ) => {
        const percentage = this.getPercentageBasis(
          parentNode.total.amount,
          node.total.amount
        );
        return R.assoc(
          propertyPath,
          this.getPercentageTotalAmountMeta(percentage),
          node
        );
      }
    );

    /**
     * Compose percentage of columns.
     * @param   {IProfitLossSheetNode[]} nodes
     * @returns {IProfitLossSheetNode[]}
     */
    private columnPercentageCompose = (
      nodes: IProfitLossSheetNode[]
    ): IProfitLossSheetNode[] => {
      const netIncomeNode = this.findNodeById(
        ProfitLossAggregateNodeId.NET_INCOME,
        nodes
      );
      return this.mapNodesDeep(
        nodes,
        this.columnPercentageMapper(netIncomeNode)
      );
    };

    /**
     * Compose percentage of income.
     * @param   {IProfitLossSheetNode[]} nodes
     * @returns {IProfitLossSheetNode[]}
     */
    private incomePercentageCompose = (
      nodes: IProfitLossSheetNode[]
    ): IProfitLossSheetNode[] => {
      const incomeNode = this.findNodeById(
        ProfitLossAggregateNodeId.INCOME,
        nodes
      );
      return this.mapNodesDeep(nodes, this.incomePercentageMapper(incomeNode));
    };

    /**
     *
     * @param {IProfitLossSheetNode[]} nodes
     * @returns {IProfitLossSheetNode[]}
     */
    private rowPercentageCompose = (
      nodes: IProfitLossSheetNode[]
    ): IProfitLossSheetNode[] => {
      return this.mapNodesDeep(nodes, this.rowPercentageMap);
    };

    /**
     *
     * @param  {IProfitLossSheetNode} netIncomeNode -
     * @param  {IProfitLossSheetNode} node -
     * @return {IProfitLossSheetNode}
     */
    private columnPercentageMapper = R.curry(
      (netIncomeNode: IProfitLossSheetNode, node: IProfitLossSheetNode) => {
        const path = 'percentageColumn';

        return R.compose(
          R.when(
            this.isNodeHasHorizTotals,
            this.assocColumnPercentageHorizTotals(netIncomeNode)
          ),
          R.ifElse(
            this.isNodeTotal,
            this.assocColumnTotalPercentage(path, netIncomeNode),
            this.assocColumnPercentage(path, netIncomeNode)
          )
        )(node);
      }
    );

    /**
     *
     * @param   {IProfitLossSheetNode} node
     * @returns {IProfitLossSheetNode}
     */
    private rowPercentageMap = (
      node: IProfitLossSheetNode
    ): IProfitLossSheetNode => {
      const path = 'percentageRow';

      return R.compose(
        R.when(this.isNodeHasHorizTotals, this.assocRowPercentageHorizTotals),
        R.ifElse(
          this.isNodeTotal,
          this.assocColumnTotalPercentage(path, node),
          this.assocColumnPercentage(path, node)
        )
      )(node);
    };

    /**
     *
     * @param   {IProfitLossSheetNode} incomeNode -
     * @param   {IProfitLossSheetNode} node -
     * @returns {IProfitLossSheetNode}
     */
    private incomePercentageMapper = R.curry(
      (incomeNode: IProfitLossSheetNode, node: IProfitLossSheetNode) => {
        const path = 'percentageIncome';

        return R.compose(
          R.when(
            this.isNodeHasHorizTotals,
            this.assocIncomePercentageHorizTotals(incomeNode)
          ),
          R.ifElse(
            this.isNodeTotal,
            this.assocColumnTotalPercentage(path, incomeNode),
            this.assocColumnPercentage(path, incomeNode)
          )
        )(node);
      }
    );

    /**
     *
     * @param {IProfitLossSheetNode} expenseNode -
     * @param {IProfitLossSheetNode} node -
     */
    private expensePercentageMapper = R.curry(
      (expenseNode: IProfitLossSheetNode, node: IProfitLossSheetNode) => {
        const path = 'percentageExpense';

        return R.compose(
          R.when(
            this.isNodeHasHorizTotals,
            this.assocExpensePercentageHorizTotals(expenseNode)
          ),
          R.ifElse(
            this.isNodeTotal,
            this.assocColumnTotalPercentage(path, expenseNode),
            this.assocColumnPercentage(path, expenseNode)
          )
        )(node);
      }
    );

    /**
     * Compose percentage of expense.
     * @param   {IProfitLossSheetNode[]} nodes
     * @returns {IProfitLossSheetNode[]}
     */
    private expensesPercentageCompose = (
      nodes: IProfitLossSheetNode[]
    ): IProfitLossSheetNode[] => {
      const expenseNode = this.findNodeById(
        ProfitLossAggregateNodeId.EXPENSES,
        nodes
      );
      return this.mapNodesDeep(
        nodes,
        this.expensePercentageMapper(expenseNode)
      );
    };

    /**
     * Compose percentage attributes.
     * @param   {IProfitLossSheetNode[]} nodes
     * @returns {IProfitLossSheetNode[]}
     */
    protected reportColumnsPercentageCompose = (
      nodes: IProfitLossSheetNode[]
    ): IProfitLossSheetNode[] => {
      return R.compose(
        R.when(this.query.isIncomePercentage, this.incomePercentageCompose),
        R.when(this.query.isColumnPercentage, this.columnPercentageCompose),
        R.when(this.query.isExpensesPercentage, this.expensesPercentageCompose),
        R.when(this.query.isRowPercentage, this.rowPercentageCompose)
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
    private assocIncomePercentageHorizTotals = R.curry(
      (incomeNode: IProfitLossSheetNode, node: IProfitLossSheetNode) => {
        const horTotalsWithIncomePerc = this.assocPercentageHorizTotals(
          'percentageIncome',
          incomeNode,
          node
        );
        return R.assoc('horizontalTotals', horTotalsWithIncomePerc, node);
      }
    );

    /**
     * Assoc expense percentage to horizontal totals nodes.
     * @param   {IProfitLossSheetNode} expenseNode -
     * @param   {IProfitLossSheetNode} node -
     * @returns {IProfitLossSheetNode}
     */
    private assocExpensePercentageHorizTotals = R.curry(
      (expenseNode: IProfitLossSheetNode, node: IProfitLossSheetNode) => {
        const horTotalsWithExpensePerc = this.assocPercentageHorizTotals(
          'percentageExpense',
          expenseNode,
          node
        );
        return R.assoc('horizontalTotals', horTotalsWithExpensePerc, node);
      }
    );

    /**
     * Assoc net income percentage to horizontal totals nodes.
     * @param   {IProfitLossSheetNode} expenseNode -
     * @param   {IProfitLossSheetNode} node -
     * @returns {IProfitLossSheetNode}
     */
    private assocColumnPercentageHorizTotals = R.curry(
      (netIncomeNode: IProfitLossSheetNode, node: IProfitLossSheetNode) => {
        const horTotalsWithExpensePerc = this.assocPercentageHorizTotals(
          'percentageColumn',
          netIncomeNode,
          node
        );
        return R.assoc('horizontalTotals', horTotalsWithExpensePerc, node);
      }
    );

    /**
     *
     */
    private assocRowPercentageHorizTotals = R.curry((node) => {
      const horTotalsWithExpensePerc = this.assocHorizontalPercentageTotals(
        'percentageRow',
        node
      );
      return R.assoc('horizontalTotals', horTotalsWithExpensePerc, node);
    });
  };
