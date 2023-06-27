import * as R from 'ramda';
import { sumBy } from 'lodash';
import { compose } from 'lodash/fp';
import {
  IProfitLossSheetEquationNode,
  IProfitLossSheetAccountNode,
  IProfitLossSchemaNode,
  IProfitLossSheetNode,
  IProfitLossSheetTotal,
} from '@/interfaces';
import { ProfitLossSheetRepository } from './ProfitLossSheetRepository';
import { FinancialPreviousYear } from '../FinancialPreviousYear';

export const ProfitLossSheetPreviousYear = (Base) =>
  class extends compose(FinancialPreviousYear)(Base) {
    repository: ProfitLossSheetRepository;

    // ---------------------------
    // # Account
    // ---------------------------
    /**
     * Assoc previous year total attribute to account node.
     * @param   {IProfitLossSheetAccountNode} accountNode
     * @returns {IProfitLossSheetAccountNode}
     */
    private assocPreviousYearTotalAccountNode = (
      accountNode: IProfitLossSheetAccountNode
    ) => {
      const total = this.repository.PYTotalAccountsLedger.whereAccountId(
        accountNode.id
      ).getClosingBalance();

      return R.assoc('previousYear', this.getAmountMeta(total), accountNode);
    };

    /**
     * Compose previous year account node.
     * @param   {IProfitLossSheetAccountNode} accountNode
     * @returns {IProfitLossSheetAccountNode}
     */
    protected previousYearAccountNodeCompose = (
      accountNode: IProfitLossSheetAccountNode
    ): IProfitLossSheetAccountNode => {
      return R.compose(
        R.when(
          this.isNodeHasHorizTotals,
          this.assocPreviousYearAccountHorizNodeCompose
        ),
        R.when(
          this.query.isPreviousYearPercentageActive,
          this.assocPreviousYearPercentageNode
        ),
        R.when(
          this.query.isPreviousYearChangeActive,
          this.assocPreviousYearChangedNode
        ),
        this.assocPreviousYearTotalAccountNode
      )(accountNode);
    };

    // ---------------------------
    // # Aggregate
    // ---------------------------
    /**
     * Assoc previous year change attribute to aggregate node.
     * @param    {IProfitLossSheetAccountNode} accountNode
     * @returns  {IProfitLossSheetAccountNode}
     */
    private assocPreviousYearTotalAggregateNode = (
      node: IProfitLossSheetAccountNode
    ): IProfitLossSheetAccountNode => {
      const total = sumBy(node.children, 'previousYear.amount');

      return R.assoc('previousYear', this.getTotalAmountMeta(total), node);
    };

    /**
     * Compose previous year to aggregate node.
     * @param   {IProfitLossSheetAccountNode} accountNode
     * @returns {IProfitLossSheetAccountNode}
     */
    protected previousYearAggregateNodeCompose = (
      accountNode: IProfitLossSheetAccountNode
    ): IProfitLossSheetAccountNode => {
      return R.compose(
        R.when(
          this.isNodeHasHorizTotals,
          this.assocPreviousYearAggregateHorizNode
        ),
        R.when(
          this.query.isPreviousYearPercentageActive,
          this.assocPreviousYearTotalPercentageNode
        ),
        R.when(
          this.query.isPreviousYearChangeActive,
          this.assocPreviousYearTotalChangeNode
        ),
        this.assocPreviousYearTotalAggregateNode
      )(accountNode);
    };

    // ---------------------------
    // # Equation
    // ---------------------------
    /**
     * Assoc previous year total to equation node.
     * @param   {(IProfitLossSchemaNode | IProfitLossSheetNode)[]} accNodes
     * @param   {string} equation
     * @param   {IProfitLossSheetNode} node
     * @returns {IProfitLossSheetEquationNode}
     */
    private assocPreviousYearTotalEquationNode = R.curry(
      (
        accNodes: (IProfitLossSchemaNode | IProfitLossSheetNode)[],
        equation: string,
        node: IProfitLossSheetNode
      ) => {
        const previousPeriodNodePath = 'previousYear.amount';
        const tableNodes = this.getNodesTableForEvaluating(
          previousPeriodNodePath,
          accNodes
        );
        // Evaluate the given equation.
        const total = this.evaluateEquation(equation, tableNodes);

        return R.assoc('previousYear', this.getTotalAmountMeta(total), node);
      }
    );

    /**
     * Previous year equation node.
     * @param   {(IProfitLossSchemaNode | IProfitLossSheetNode)[]} accNodes -
     * @param   {string} node
     * @param   {IProfitLossSheetEquationNode} node
     * @returns {IProfitLossSheetEquationNode}
     */
    protected previousYearEquationNodeCompose = R.curry(
      (
        accNodes: (IProfitLossSchemaNode | IProfitLossSheetNode)[],
        equation: string,
        node: IProfitLossSheetEquationNode
      ) => {
        return R.compose(
          R.when(
            this.isNodeHasHorizTotals,
            this.assocPreviousYearEquationHorizNode(accNodes, equation)
          ),
          R.when(
            this.query.isPreviousYearPercentageActive,
            this.assocPreviousYearTotalPercentageNode
          ),
          R.when(
            this.query.isPreviousYearChangeActive,
            this.assocPreviousYearTotalChangeNode
          ),
          this.assocPreviousYearTotalEquationNode(accNodes, equation)
        )(node);
      }
    );

    // ----------------------------------
    // # Horizontal Nodes - Account
    // ----------------------------------
    /**
     * Assoc previous year to account horizontal total node.
     * @param   {IProfitLossSheetAccountNode} node
     * @returns
     */
    private assocPreviousYearAccountHorizTotal = R.curry(
      (node: IProfitLossSheetAccountNode, totalNode) => {
        const total = this.repository.PYPeriodsAccountsLedger.whereAccountId(
          node.id
        )
          .whereFromDate(totalNode.previousYearFromDate.date)
          .whereToDate(totalNode.previousYearToDate.date)
          .getClosingBalance();

        return R.assoc('previousYear', this.getAmountMeta(total), totalNode);
      }
    );

    /**
     * Previous year account horizontal node composer.
     * @param   {IProfitLossSheetAccountNode} horizontalTotalNode
     * @param   {IProfitLossSheetTotal} horizontalTotalNode -
     * @returns {IProfitLossSheetTotal}
     */
    private previousYearAccountHorizNodeCompose = R.curry(
      (
        node: IProfitLossSheetAccountNode,
        horizontalTotalNode: IProfitLossSheetTotal
      ): IProfitLossSheetTotal => {
        return R.compose(
          R.when(
            this.query.isPreviousYearPercentageActive,
            this.assocPreviousYearPercentageNode
          ),
          R.when(
            this.query.isPreviousYearChangeActive,
            this.assocPreviousYearChangedNode
          ),
          R.when(
            this.query.isPreviousYearActive,
            this.assocPreviousYearAccountHorizTotal(node)
          ),
          R.when(
            this.query.isPreviousYearActive,
            this.assocPreviousYearHorizNodeFromToDates
          )
        )(horizontalTotalNode);
      }
    );

    /**
     *
     * @param   {IProfitLossSheetAccountNode} node
     * @returns {IProfitLossSheetAccountNode}
     */
    private assocPreviousYearAccountHorizNodeCompose = (
      node: IProfitLossSheetAccountNode
    ): IProfitLossSheetAccountNode => {
      const horizontalTotals = R.map(
        this.previousYearAccountHorizNodeCompose(node),
        node.horizontalTotals
      );
      return R.assoc('horizontalTotals', horizontalTotals, node);
    };

    // ----------------------------------
    // # Horizontal Nodes - Aggregate
    // ----------------------------------
    /**
     *
     */
    private assocPreviousYearAggregateHorizTotal = R.curry(
      (node, index, totalNode) => {
        const total = this.getPYHorizNodesTotalSummation(index, node);

        return R.assoc(
          'previousYear',
          this.getTotalAmountMeta(total),
          totalNode
        );
      }
    );

    /**
     *
     */
    private previousYearAggregateHorizNodeCompose = R.curry(
      (node, horizontalTotalNode, index: number) => {
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
            this.query.isPreviousYearActive,
            this.assocPreviousYearAggregateHorizTotal(node, index)
          )
        )(horizontalTotalNode);
      }
    );

    /**
     *
     * @param   {IProfitLossSheetAccountNode} node
     * @returns {IProfitLossSheetAccountNode}
     */
    private assocPreviousYearAggregateHorizNode = (
      node: IProfitLossSheetAccountNode
    ): IProfitLossSheetAccountNode => {
      const horizontalTotals = R.addIndex(R.map)(
        this.previousYearAggregateHorizNodeCompose(node),
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
     * @param {number} index
     * @param {} totalNode -
     */
    private assocPreviousYearEquationHorizTotal = R.curry(
      (
        accNodes: IProfitLossSheetNode[],
        equation: string,
        index: number,
        totalNode
      ) => {
        const scopes = this.getNodesTableForEvaluating(
          `horizontalTotals[${index}].previousYear.amount`,
          accNodes
        );
        const total = this.evaluateEquation(equation, scopes);

        return R.assoc(
          'previousYear',
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
    private previousYearEquationHorizNodeCompose = R.curry(
      (
        accNodes: IProfitLossSheetNode[],
        equation: string,
        horizontalTotalNode,
        index: number
      ) => {
        const assocHorizTotal = this.assocPreviousYearEquationHorizTotal(
          accNodes,
          equation,
          index
        );
        return R.compose(
          R.when(
            this.query.isPreviousYearPercentageActive,
            this.assocPreviousYearTotalPercentageNode
          ),
          R.when(
            this.query.isPreviousYearChangeActive,
            this.assocPreviousYearTotalChangeNode
          ),
          R.when(this.query.isPreviousYearActive, assocHorizTotal)
        )(horizontalTotalNode);
      }
    );

    /**
     *
     * @param {IProfitLossSheetNode[]} accNodes
     * @param {string} equation
     * @param {IProfitLossSheetEquationNode} node
     */
    private assocPreviousYearEquationHorizNode = R.curry(
      (
        accNodes: IProfitLossSheetNode[],
        equation: string,
        node: IProfitLossSheetEquationNode
      ) => {
        const horizontalTotals = R.addIndex(R.map)(
          this.previousYearEquationHorizNodeCompose(accNodes, equation),
          node.horizontalTotals
        );
        return R.assoc('horizontalTotals', horizontalTotals, node);
      }
    );
  };
