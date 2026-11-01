import { flow } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import { sumBy } from 'lodash';
import { assoc, when } from '@/common/fp';
import {
  IProfitLossSheetEquationNode,
  IProfitLossSheetAccountNode,
  IProfitLossSheetAccountsNode,
  IProfitLossHorizontalDatePeriodNode,
  IProfitLossSchemaNode,
  IProfitLossSheetNode,
} from './ProfitLossSheet.types';
import { ProfitLossSheetRepository } from './ProfitLossSheetRepository';
import { FinancialPreviousYear } from '../../common/FinancialPreviousYear';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialSheet } from '../../common/FinancialSheet';
import { ProfitLossSheetQuery } from './ProfitLossSheetQuery';

export const ProfitLossSheetPreviousYear = <
  T extends GConstructor<FinancialSheet>,
>(
  Base: T,
) =>
  class extends flow(FinancialPreviousYear)(Base) {
    repository: ProfitLossSheetRepository;
    query: ProfitLossSheetQuery;

    protected getNodesTableForEvaluating: (path?: string, nodes?) => any;
    protected evaluateEquation: (
      equation: string,
      scope: { [key: string | number]: number },
    ) => number;
    protected isNodeHasHorizTotals: (node) => boolean;

    // ---------------------------
    // # Account
    // ---------------------------
    /**
     * Assoc previous year total attribute to account node.
     * @param   {IProfitLossSheetAccountNode} accountNode
     * @returns {IProfitLossSheetAccountNode}
     */
    private assocPreviousYearTotalAccountNode = (
      accountNode: IProfitLossSheetAccountNode,
    ) => {
      const accountIds = this.repository.getAccountsIdsIncludingChildren(
        accountNode.id,
      );
      const total =
        this.repository.PYTotalAccountsLedger.whereAccountsIds(
          accountIds,
        ).getClosingBalance();

      return assoc('previousYear', this.getAmountMeta(total), accountNode);
    };

    /**
     * Compose previous year account node.
     * @param {IProfitLossSheetAccountNode} accountNode
     * @returns {IProfitLossSheetAccountNode}
     */
    protected previousYearAccountNodeCompose = (
      accountNode: IProfitLossSheetAccountNode,
    ): IProfitLossSheetAccountNode => {
      return flow(
        this.assocPreviousYearTotalAccountNode,
        when(
          this.query.isPreviousYearChangeActive,
          this.assocPreviousYearChangetNode,
        ),
        when(
          this.query.isPreviousYearPercentageActive,
          this.assocPreviousYearPercentageNode,
        ),
        when(
          this.isNodeHasHorizTotals,
          this.assocPreviousYearAccountHorizNodeCompose,
        ),
      )(accountNode) as IProfitLossSheetAccountNode;
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
      node: IProfitLossSheetAccountsNode,
    ): IProfitLossSheetAccountsNode => {
      const total = sumBy(node.children, 'previousYear.amount');

      return assoc('previousYear', this.getTotalAmountMeta(total), node);
    };

    /**
     * Compose previous year to aggregate node.
     * @param   {IProfitLossSheetAccountNode} accountNode
     * @returns {IProfitLossSheetAccountNode}
     */
    protected previousYearAggregateNodeCompose = (
      accountNode: IProfitLossSheetAccountsNode,
    ): IProfitLossSheetAccountsNode => {
      return flow(
        this.assocPreviousYearTotalAggregateNode,
        when(
          this.query.isPreviousYearChangeActive,
          this.assocPreviousYearTotalChangeNode,
        ),
        when(
          this.query.isPreviousYearPercentageActive,
          this.assocPreviousYearTotalPercentageNode,
        ),
        when(
          this.isNodeHasHorizTotals,
          this.assocPreviousYearAggregateHorizNode,
        ),
      )(accountNode) as IProfitLossSheetAccountsNode;
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
    private assocPreviousYearTotalEquationNode =
      (
        accNodes: (IProfitLossSchemaNode | IProfitLossSheetNode)[],
        equation: string,
      ) =>
      (node: IProfitLossSheetNode) => {
        const previousPeriodNodePath = 'previousYear.amount';
        const tableNodes = this.getNodesTableForEvaluating(
          previousPeriodNodePath,
          accNodes,
        );
        // Evaluate the given equation.
        const total = this.evaluateEquation(equation, tableNodes);

        return assoc('previousYear', this.getTotalAmountMeta(total), node);
      };

    /**
     * Previous year equation node.
     * @param   {(IProfitLossSchemaNode | IProfitLossSheetNode)[]} accNodes -
     * @param   {string} node
     * @param   {IProfitLossSheetEquationNode} node
     * @returns {IProfitLossSheetEquationNode}
     */
    protected previousYearEquationNodeCompose =
      (
        accNodes: (IProfitLossSchemaNode | IProfitLossSheetNode)[],
        equation: string,
      ) =>
      (node: IProfitLossSheetEquationNode) => {
        return flow(
          this.assocPreviousYearTotalEquationNode(accNodes, equation),
          when(
            this.query.isPreviousYearChangeActive,
            this.assocPreviousYearTotalChangeNode,
          ),
          when(
            this.query.isPreviousYearPercentageActive,
            this.assocPreviousYearTotalPercentageNode,
          ),
          when(
            this.isNodeHasHorizTotals,
            this.assocPreviousYearEquationHorizNode(accNodes, equation),
          ),
        )(node);
      };

    // ----------------------------------
    // # Horizontal Nodes - Account
    // ----------------------------------
    /**
     * Assoc preivous year to account horizontal total node.
     * @param   {IProfitLossSheetAccountNode} node
     * @returns
     */
    private assocPreviousYearAccountHorizTotal =
      (node: IProfitLossSheetAccountNode) =>
      (totalNode: IProfitLossHorizontalDatePeriodNode) => {
        const accountIds = this.repository.getAccountsIdsIncludingChildren(
          node.id,
        );
        const total = this.repository.PYPeriodsAccountsLedger.whereAccountsIds(
          accountIds,
        )
          .whereFromDate(totalNode.previousYearFromDate.date)
          .whereToDate(totalNode.previousYearToDate.date)
          .getClosingBalance();

        return assoc('previousYear', this.getAmountMeta(total), totalNode);
      };

    /**
     * Previous year account horizontal node composer.
     * @param   {IProfitLossSheetAccountNode} node
     * @param   {IProfitLossHorizontalDatePeriodNode} horizontalTotalNode -
     * @returns {IProfitLossHorizontalDatePeriodNode}
     */
    private previousYearAccountHorizNodeCompose =
      (node: IProfitLossSheetAccountNode) =>
      (horizontalTotalNode: IProfitLossHorizontalDatePeriodNode) => {
        return flow(
          when(
            this.query.isPreviousYearActive,
            this.assocPreviousYearHorizNodeFromToDates,
          ),
          when(
            this.query.isPreviousYearActive,
            this.assocPreviousYearAccountHorizTotal(node),
          ),
          when(
            this.query.isPreviousYearChangeActive,
            this.assocPreviousYearChangetNode,
          ),
          when(
            this.query.isPreviousYearPercentageActive,
            this.assocPreviousYearPercentageNode,
          ),
        )(horizontalTotalNode) as IProfitLossHorizontalDatePeriodNode;
      };

    /**
     *
     * @param   {IProfitLossSheetAccountNode} node
     * @returns {IProfitLossSheetAccountNode}
     */
    private assocPreviousYearAccountHorizNodeCompose = (
      node: IProfitLossSheetAccountNode,
    ): IProfitLossSheetAccountNode => {
      const horizontalTotals = A.map(
        (totalNode: IProfitLossHorizontalDatePeriodNode) =>
          this.previousYearAccountHorizNodeCompose(node)(totalNode),
      )(node.horizontalTotals);
      return assoc('horizontalTotals', horizontalTotals, node);
    };

    // ----------------------------------
    // # Horizontal Nodes - Aggregate
    // ----------------------------------
    /**
     *
     */
    private assocPreviousYearAggregateHorizTotal =
      (node: IProfitLossSheetAccountsNode, index: number) =>
      (totalNode: IProfitLossHorizontalDatePeriodNode) => {
        const total = this.getPYHorizNodesTotalSumation(index, node);

        return assoc('previousYear', this.getTotalAmountMeta(total), totalNode);
      };

    /**
     *
     */
    private previousYearAggregateHorizNodeCompose =
      (node: IProfitLossSheetAccountsNode) =>
      (
        horizontalTotalNode: IProfitLossHorizontalDatePeriodNode,
        index: number,
      ): IProfitLossHorizontalDatePeriodNode => {
        return flow(
          when(
            this.query.isPreviousYearActive,
            this.assocPreviousYearAggregateHorizTotal(node, index),
          ),
          when(
            this.query.isPreviousYearChangeActive,
            this.assocPreviousYearTotalChangeNode,
          ),
          when(
            this.query.isPreviousYearPercentageActive,
            this.assocPreviousYearTotalPercentageNode,
          ),
        )(horizontalTotalNode) as IProfitLossHorizontalDatePeriodNode;
      };

    /**
     *
     * @param   {IProfitLossSheetAccountNode} node
     * @returns {IProfitLossSheetAccountNode}
     */
    private assocPreviousYearAggregateHorizNode = (
      node: IProfitLossSheetAccountsNode,
    ): IProfitLossSheetAccountsNode => {
      const horizontalTotals = A.mapWithIndex(
        (index: number, totalNode: IProfitLossHorizontalDatePeriodNode) =>
          this.previousYearAggregateHorizNodeCompose(node)(totalNode, index),
      )(node.horizontalTotals);
      return assoc('horizontalTotals', horizontalTotals, node);
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
    private assocPreviousYearEquationHorizTotal =
      (
        accNodes: (IProfitLossSchemaNode | IProfitLossSheetNode)[],
        equation: string,
        index: number,
      ) =>
      (totalNode) => {
        const scopes = this.getNodesTableForEvaluating(
          `horizontalTotals[${index}].previousYear.amount`,
          accNodes,
        );
        const total = this.evaluateEquation(equation, scopes);

        return assoc('previousYear', this.getTotalAmountMeta(total), totalNode);
      };

    /**
     *
     * @param {IProfitLossSheetNode[]} accNodes -
     * @param {string} equation
     * @param {} horizontalTotalNode
     * @param {number} index
     */
    private previousYearEquationHorizNodeCompose =
      (
        accNodes: (IProfitLossSchemaNode | IProfitLossSheetNode)[],
        equation: string,
      ) =>
      (horizontalTotalNode, index: number) => {
        const assocHorizTotal = this.assocPreviousYearEquationHorizTotal(
          accNodes,
          equation,
          index,
        );
        return flow(
          when(this.query.isPreviousYearActive, assocHorizTotal),
          when(
            this.query.isPreviousYearChangeActive,
            this.assocPreviousYearTotalChangeNode,
          ),
          when(
            this.query.isPreviousYearPercentageActive,
            this.assocPreviousYearTotalPercentageNode,
          ),
        )(horizontalTotalNode);
      };

    /**
     *
     * @param {IProfitLossSheetNode[]} accNodes
     * @param {string} equation
     * @param {IProfitLossSheetEquationNode} node
     */
    private assocPreviousYearEquationHorizNode =
      (
        accNodes: (IProfitLossSchemaNode | IProfitLossSheetNode)[],
        equation: string,
      ) =>
      (node: IProfitLossSheetEquationNode) => {
        const horizontalTotals = A.mapWithIndex(
          (index: number, totalNode: IProfitLossHorizontalDatePeriodNode) =>
            this.previousYearEquationHorizNodeCompose(accNodes, equation)(
              totalNode,
              index,
            ),
        )(node.horizontalTotals);
        return assoc('horizontalTotals', horizontalTotals, node);
      };
  };
