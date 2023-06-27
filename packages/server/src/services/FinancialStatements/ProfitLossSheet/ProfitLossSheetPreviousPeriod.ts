import * as R from 'ramda';
import { sumBy } from 'lodash';
import {
  IProfitLossHorizontalDatePeriodNode,
  IProfitLossSchemaNode,
  IProfitLossSheetAccountNode,
  IProfitLossSheetAccountsNode,
  IProfitLossSheetEquationNode,
  IProfitLossSheetNode,
} from '@/interfaces';
import { FinancialPreviousPeriod } from '../FinancialPreviousPeriod';
import { ProfitLossSheetQuery } from './ProfitLossSheetQuery';

export const ProfitLossSheetPreviousPeriod = (Base) =>
  class extends R.compose(FinancialPreviousPeriod)(Base) {
    query: ProfitLossSheetQuery;

    // ---------------------------
    // # Account
    // ---------------------------
    /**
     * Assoc previous period change attribute to account node.
     * @param    {IProfitLossSheetAccountNode} accountNode
     * @returns  {IProfitLossSheetAccountNode}
     */
    protected assocPreviousPeriodTotalAccountNode = (
      node: IProfitLossSheetAccountNode
    ): IProfitLossSheetAccountNode => {
      const total = this.repository.PPTotalAccountsLedger.whereAccountId(
        node.id
      ).getClosingBalance();

      return R.assoc('previousPeriod', this.getAmountMeta(total), node);
    };

    /**
     * Compose previous period account node.
     * @param   {IProfitLossSheetAccountNode} accountNode
     * @returns {IProfitLossSheetAccountNode}
     */
    protected previousPeriodAccountNodeCompose = (
      accountNode: IProfitLossSheetAccountNode
    ): IProfitLossSheetAccountNode => {
      return R.compose(
        R.when(
          this.isNodeHasHorizTotals,
          this.assocPreviousPeriodAccountHorizNodeCompose
        ),
        R.when(
          this.query.isPreviousPeriodPercentageActive,
          this.assocPreviousPeriodPercentageNode
        ),
        R.when(
          this.query.isPreviousPeriodChangeActive,
          this.assocPreviousPeriodChangeNode
        ),
        this.assocPreviousPeriodTotalAccountNode
      )(accountNode);
    };

    // ---------------------------
    // # Aggregate
    // ---------------------------
    /**
     * Assoc previous period total attribute to aggregate node.
     * @param   {IProfitLossSheetAccountNode} accountNode
     * @returns {IProfitLossSheetAccountNode}
     */
    private assocPreviousPeriodTotalAggregateNode = (
      node: IProfitLossSheetAccountNode
    ) => {
      const total = sumBy(node.children, 'previousPeriod.amount');

      return R.assoc('previousPeriod', this.getTotalAmountMeta(total), node);
    };

    /**
     * Compose previous period to aggregate node.
     * @param   {IProfitLossSheetAccountNode} accountNode
     * @returns {IProfitLossSheetAccountNode}
     */
    protected previousPeriodAggregateNodeCompose = (
      accountNode: IProfitLossSheetAccountNode
    ): IProfitLossSheetAccountNode => {
      return R.compose(
        R.when(
          this.isNodeHasHorizTotals,
          this.assocPreviousPeriodAggregateHorizNode
        ),
        R.when(
          this.query.isPreviousPeriodPercentageActive,
          this.assocPreviousPeriodTotalPercentageNode
        ),
        R.when(
          this.query.isPreviousPeriodChangeActive,
          this.assocPreviousPeriodTotalChangeNode
        ),
        this.assocPreviousPeriodTotalAggregateNode
      )(accountNode);
    };

    // ---------------------------
    // # Equation
    // --------------------------
    /**
     *
     * @param   {(IProfitLossSchemaNode | IProfitLossSheetNode)[]} accNodes
     * @param   {string} equation
     * @param   {IProfitLossSheetNode} node
     * @returns {IProfitLossSheetEquationNode}
     */
    private assocPreviousPeriodTotalEquationNode = R.curry(
      (
        accNodes: (IProfitLossSchemaNode | IProfitLossSheetNode)[],
        equation: string,
        node: IProfitLossSheetEquationNode
      ): IProfitLossSheetEquationNode => {
        const previousPeriodNodePath = 'previousPeriod.amount';
        const tableNodes = this.getNodesTableForEvaluating(
          previousPeriodNodePath,
          accNodes
        );
        // Evaluate the given equation.
        const total = this.evaluateEquation(equation, tableNodes);

        return R.assoc('previousPeriod', this.getTotalAmountMeta(total), node);
      }
    );

    /**
     *
     * @param   {(IProfitLossSchemaNode | IProfitLossSheetNode)[]} accNodes -
     * @param   {string} node
     * @param   {IProfitLossSheetEquationNode} node
     * @returns {IProfitLossSheetEquationNode}
     */
    protected previousPeriodEquationNodeCompose = R.curry(
      (
        accNodes: (IProfitLossSchemaNode | IProfitLossSheetNode)[],
        equation: string,
        node: IProfitLossSheetEquationNode
      ): IProfitLossSheetEquationNode => {
        return R.compose(
          R.when(
            this.isNodeHasHorizTotals,
            this.assocPreviousPeriodEquationHorizNode(accNodes, equation)
          ),
          R.when(
            this.query.isPreviousPeriodPercentageActive,
            this.assocPreviousPeriodTotalPercentageNode
          ),
          R.when(
            this.query.isPreviousPeriodChangeActive,
            this.assocPreviousPeriodTotalChangeNode
          ),
          this.assocPreviousPeriodTotalEquationNode(accNodes, equation)
        )(node);
      }
    );

    // ---------------------------
    // # Horizontal Nodes - Account
    // --------------------------
    /**
     * Assoc previous period to account horizontal node.
     * @param   {IProfitLossSheetAccountNode} node
     * @param   {IProfitLossHorizontalDatePeriodNode} totalNode
     * @returns {IProfitLossHorizontalDatePeriodNode}
     */
    private assocPerviousPeriodAccountHorizTotal = R.curry(
      (
        node: IProfitLossSheetAccountNode,
        totalNode: IProfitLossHorizontalDatePeriodNode
      ): IProfitLossHorizontalDatePeriodNode => {
        const total = this.repository.PPPeriodsAccountsLedger.whereAccountId(
          node.id
        )
          .whereFromDate(totalNode.previousPeriodFromDate.date)
          .whereToDate(totalNode.previousPeriodToDate.date)
          .getClosingBalance();

        return R.assoc('previousPeriod', this.getAmountMeta(total), totalNode);
      }
    );

    /**
     * @param {IProfitLossSheetAccountNode} node
     * @param {IProfitLossSheetTotal}
     */
    private previousPeriodAccountHorizNodeCompose = R.curry(
      (
        node: IProfitLossSheetAccountNode,
        horizontalTotalNode: IProfitLossHorizontalDatePeriodNode,
        index: number
      ): IProfitLossHorizontalDatePeriodNode => {
        return R.compose(
          R.when(
            this.query.isPreviousPeriodPercentageActive,
            this.assocPreviousPeriodPercentageNode
          ),
          R.when(
            this.query.isPreviousPeriodChangeActive,
            this.assocPreviousPeriodChangeNode
          ),
          this.assocPerviousPeriodAccountHorizTotal(node),
          this.assocPreviousPeriodHorizNodeFromToDates(
            this.query.displayColumnsBy
          )
        )(horizontalTotalNode);
      }
    );

    /**
     *
     * @param {IProfitLossSheetAccountNode} node
     * @returns {IProfitLossSheetAccountNode}
     */
    private assocPreviousPeriodAccountHorizNodeCompose = (
      node: IProfitLossSheetAccountNode
    ): IProfitLossSheetAccountNode => {
      const horizontalTotals = R.addIndex(R.map)(
        this.previousPeriodAccountHorizNodeCompose(node),
        node.horizontalTotals
      );
      return R.assoc('horizontalTotals', horizontalTotals, node);
    };

    // ----------------------------------
    // # Horizontal Nodes - Aggregate
    // ----------------------------------
    /**
     * Assoc previous period total to aggregate horizontal nodes.
     * @param  {IProfitLossSheetAccountsNode} node
     * @param  {number} index
     * @param  {any} totalNode
     * @return {}
     */
    private assocPreviousPeriodAggregateHorizTotal = R.curry(
      (
        node: IProfitLossSheetAccountsNode,
        index: number,
        totalNode: IProfitLossHorizontalDatePeriodNode
      ) => {
        const total = this.getPPHorizNodesTotalSummation(index, node);

        return R.assoc(
          'previousPeriod',
          this.getTotalAmountMeta(total),
          totalNode
        );
      }
    );

    /**
     *
     * @param   {IProfitLossSheetAccountsNode} node
     * @param   {IProfitLossHorizontalDatePeriodNode} horizontalTotalNode -
     * @param   {number} index
     * @returns {IProfitLossHorizontalDatePeriodNode}
     */
    private previousPeriodAggregateHorizNodeCompose = R.curry(
      (
        node: IProfitLossSheetAccountsNode,
        horizontalTotalNode: IProfitLossHorizontalDatePeriodNode,
        index: number
      ): IProfitLossHorizontalDatePeriodNode => {
        return R.compose(
          R.when(
            this.query.isPreviousPeriodPercentageActive,
            this.assocPreviousPeriodTotalPercentageNode
          ),
          R.when(
            this.query.isPreviousPeriodChangeActive,
            this.assocPreviousPeriodTotalChangeNode
          ),
          R.when(
            this.query.isPreviousPeriodActive,
            this.assocPreviousPeriodAggregateHorizTotal(node, index)
          ),
          R.when(
            this.query.isPreviousPeriodActive,
            this.assocPreviousPeriodHorizNodeFromToDates(
              this.query.displayColumnsBy
            )
          )
        )(horizontalTotalNode);
      }
    );

    /**
     * Assoc previous period to aggregate horizontal nodes.
     * @param {IProfitLossSheetAccountsNode} node
     * @returns
     */
    private assocPreviousPeriodAggregateHorizNode = (
      node: IProfitLossSheetAccountsNode
    ): IProfitLossSheetAccountsNode => {
      const horizontalTotals = R.addIndex(R.map)(
        this.previousPeriodAggregateHorizNodeCompose(node),
        node.horizontalTotals
      );
      return R.assoc('horizontalTotals', horizontalTotals, node);
    };

    // ----------------------------------
    // # Horizontal Nodes - Equation
    // ----------------------------------
    /**
     *
     * @param {IProfitLossSheetNode[]} accNodes -
     * @param {string} equation
     * @param {index} number
     * @param {} totalNode
     */
    private assocPreviousPeriodEquationHorizTotal = R.curry(
      (
        accNodes: IProfitLossSheetNode[],
        equation: string,
        index: number,
        totalNode
      ): IProfitLossSheetNode => {
        const scopes = this.getNodesTableForEvaluating(
          `horizontalTotals[${index}].previousPeriod.amount`,
          accNodes
        );
        const total = this.evaluateEquation(equation, scopes);

        return R.assoc(
          'previousPeriod',
          this.getTotalAmountMeta(total),
          totalNode
        );
      }
    );

    /**
     *
     * @param {IProfitLossSheetNode[]} accNodes -
     * @param {string} equation
     * @param {} horizontalTotalNode
     * @param {number} index
     */
    private previousPeriodEquationHorizNodeCompose = R.curry(
      (
        accNodes: IProfitLossSheetNode[],
        equation: string,
        horizontalTotalNode,
        index: number
      ) => {
        const assocHorizTotal = this.assocPreviousPeriodEquationHorizTotal(
          accNodes,
          equation,
          index
        );
        return R.compose(
          R.when(
            this.query.isPreviousPeriodPercentageActive,
            this.assocPreviousPeriodTotalPercentageNode
          ),
          R.when(
            this.query.isPreviousPeriodChangeActive,
            this.assocPreviousPeriodTotalChangeNode
          ),
          R.when(this.query.isPreviousPeriodActive, assocHorizTotal),
          R.when(
            this.query.isPreviousPeriodActive,
            this.assocPreviousPeriodHorizNodeFromToDates(
              this.query.displayColumnsBy
            )
          )
        )(horizontalTotalNode);
      }
    );

    /**
     * Assoc previous period equation to horizontal nodes.
     * @parma  {IProfitLossSheetNode[]} accNodes -
     * @param  {string} equation
     * @param  {IProfitLossSheetEquationNode} node
     * @return {IProfitLossSheetEquationNode}
     */
    private assocPreviousPeriodEquationHorizNode = R.curry(
      (
        accNodes: IProfitLossSheetNode[],
        equation: string,
        node: IProfitLossSheetEquationNode
      ): IProfitLossSheetEquationNode => {
        const horizontalTotals = R.addIndex(R.map)(
          this.previousPeriodEquationHorizNodeCompose(accNodes, equation),
          node.horizontalTotals
        );
        return R.assoc('horizontalTotals', horizontalTotals, node);
      }
    );
  };
