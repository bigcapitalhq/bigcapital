import { flow } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import { sumBy } from 'lodash';
import { assoc, when } from '@/common/fp';
import {
  IProfitLossHorizontalDatePeriodNode,
  IProfitLossSchemaNode,
  IProfitLossSheetAccountNode,
  IProfitLossSheetAccountsNode,
  IProfitLossSheetEquationNode,
  IProfitLossSheetNode,
} from './ProfitLossSheet.types';
import { ProfitLossSheetQuery } from './ProfitLossSheetQuery';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialSheet } from '../../common/FinancialSheet';
import { FinancialPreviousPeriod } from '../../common/FinancialPreviousPeriod';
import { IFinancialDatePeriodsUnit } from '../../types/Report.types';
import { ProfitLossSheetRepository } from './ProfitLossSheetRepository';

export const ProfitLossSheetPreviousPeriod = <
  T extends GConstructor<FinancialSheet>,
>(
  Base: T,
) =>
  class extends flow(FinancialPreviousPeriod)(Base) {
    query: ProfitLossSheetQuery;
    repository: ProfitLossSheetRepository;

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
     * Assoc previous period change attribute to account node.
     * @param {IProfitLossSheetAccountNode} accountNode
     * @returns  {IProfitLossSheetAccountNode}
     */
    protected assocPreviousPeriodTotalAccountNode = (
      node: IProfitLossSheetAccountNode,
    ): IProfitLossSheetAccountNode => {
      const accountIds = this.repository.getAccountsIdsIncludingChildren(
        node.id,
      );
      const total =
        this.repository.PPTotalAccountsLedger.whereAccountsIds(
          accountIds,
        ).getClosingBalance();

      return assoc('previousPeriod', this.getAmountMeta(total), node);
    };

    /**
     * Compose previous period account node.
     * @param {IProfitLossSheetAccountNode} accountNode
     * @returns {IProfitLossSheetAccountNode}
     */
    protected previousPeriodAccountNodeCompose = (
      accountNode: IProfitLossSheetAccountNode,
    ): IProfitLossSheetAccountNode => {
      return flow(
        this.assocPreviousPeriodTotalAccountNode,
        when(
          this.query.isPreviousPeriodChangeActive,
          this.assocPreviousPeriodChangeNode,
        ),
        when(
          this.query.isPreviousPeriodPercentageActive,
          this.assocPreviousPeriodPercentageNode,
        ),
        when(
          this.isNodeHasHorizTotals,
          this.assocPreviousPeriodAccountHorizNodeCompose,
        ),
      )(accountNode) as IProfitLossSheetAccountNode;
    };

    // ---------------------------
    // # Aggregate
    // ---------------------------
    /**
     * Assoc previous period total attribute to aggregate node.
     * @param {IProfitLossSheetAccountNode} accountNode
     * @returns {IProfitLossSheetAccountNode}
     */
    private assocPreviousPeriodTotalAggregateNode = (
      node: IProfitLossSheetAccountsNode,
    ): IProfitLossSheetAccountsNode => {
      const total = sumBy(node.children, 'previousPeriod.amount');

      return assoc('previousPeriod', this.getTotalAmountMeta(total), node);
    };

    /**
     * Compose previous period to aggregate node.
     * @param {IProfitLossSheetAccountNode} accountNode
     * @returns {IProfitLossSheetAccountNode}
     */
    protected previousPeriodAggregateNodeCompose = (
      accountNode: IProfitLossSheetAccountsNode,
    ): IProfitLossSheetAccountsNode => {
      return flow(
        this.assocPreviousPeriodTotalAggregateNode,
        when(
          this.query.isPreviousPeriodChangeActive,
          this.assocPreviousPeriodTotalChangeNode,
        ),
        when(
          this.query.isPreviousPeriodPercentageActive,
          this.assocPreviousPeriodTotalPercentageNode,
        ),
        when(
          this.isNodeHasHorizTotals,
          this.assocPreviousPeriodAggregateHorizNode,
        ),
      )(accountNode) as IProfitLossSheetAccountsNode;
    };

    // ---------------------------
    // # Equation
    // --------------------------
    /**
     *
     * @param {(IProfitLossSchemaNode | IProfitLossSheetNode)[]} accNodes
     * @param {string} equation
     * @param {IProfitLossSheetNode} node
     * @returns {IProfitLossSheetEquationNode}
     */
    private assocPreviousPeriodTotalEquationNode =
      (
        accNodes: (IProfitLossSchemaNode | IProfitLossSheetNode)[],
        equation: string,
      ) =>
      (node: IProfitLossSheetEquationNode): IProfitLossSheetEquationNode => {
        const previousPeriodNodePath = 'previousPeriod.amount';
        const tableNodes = this.getNodesTableForEvaluating(
          previousPeriodNodePath,
          accNodes,
        );
        // Evaluate the given equation.
        const total = this.evaluateEquation(equation, tableNodes);

        return assoc('previousPeriod', this.getTotalAmountMeta(total), node);
      };

    /**
     *
     * @param {(IProfitLossSchemaNode | IProfitLossSheetNode)[]} accNodes -
     * @param {string} node
     * @param {IProfitLossSheetEquationNode} node
     * @returns {IProfitLossSheetEquationNode}
     */
    protected previousPeriodEquationNodeCompose =
      (
        accNodes: (IProfitLossSchemaNode | IProfitLossSheetNode)[],
        equation: string,
      ) =>
      (node: IProfitLossSheetEquationNode): IProfitLossSheetEquationNode => {
        return flow(
          this.assocPreviousPeriodTotalEquationNode(accNodes, equation),
          when(
            this.query.isPreviousPeriodChangeActive,
            this.assocPreviousPeriodTotalChangeNode,
          ),
          when(
            this.query.isPreviousPeriodPercentageActive,
            this.assocPreviousPeriodTotalPercentageNode,
          ),
          when(
            this.isNodeHasHorizTotals,
            this.assocPreviousPeriodEquationHorizNode(accNodes, equation),
          ),
        )(node) as IProfitLossSheetEquationNode;
      };

    // ---------------------------
    // # Horizontal Nodes - Account
    // --------------------------
    /**
     * Assoc previous period to account horizontal node.
     * @param   {IProfitLossSheetAccountNode} node
     * @param   {IProfitLossHorizontalDatePeriodNode} totalNode
     * @returns {IProfitLossHorizontalDatePeriodNode}
     */
    private assocPerviousPeriodAccountHorizTotal =
      (node: IProfitLossSheetAccountNode) =>
      (
        totalNode: IProfitLossHorizontalDatePeriodNode,
      ): IProfitLossHorizontalDatePeriodNode => {
        const accountIds = this.repository.getAccountsIdsIncludingChildren(
          node.id,
        );
        const total = this.repository.PPPeriodsAccountsLedger.whereAccountsIds(
          accountIds,
        )
          .whereFromDate(totalNode.previousPeriodFromDate.date)
          .whereToDate(totalNode.previousPeriodToDate.date)
          .getClosingBalance();

        return assoc('previousPeriod', this.getAmountMeta(total), totalNode);
      };

    /**
     * @param {IProfitLossSheetAccountNode} node
     * @param {IProfitLossSheetTotal}
     */
    private previousPeriodAccountHorizNodeCompose =
      (node: IProfitLossSheetAccountNode) =>
      (
        horizontalTotalNode: IProfitLossHorizontalDatePeriodNode,
        _index: number,
      ): IProfitLossHorizontalDatePeriodNode => {
        return flow(
          this.assocPreviousPeriodHorizNodeFromToDates(
            this.query.displayColumnsBy as IFinancialDatePeriodsUnit,
          ),
          this.assocPerviousPeriodAccountHorizTotal(node),
          when(
            this.query.isPreviousPeriodChangeActive,
            this.assocPreviousPeriodChangeNode,
          ),
          when(
            this.query.isPreviousPeriodPercentageActive,
            this.assocPreviousPeriodPercentageNode,
          ),
        )(horizontalTotalNode) as IProfitLossHorizontalDatePeriodNode;
      };

    /**
     *
     * @param {IProfitLossSheetAccountNode} node
     * @returns {IProfitLossSheetAccountNode}
     */
    private assocPreviousPeriodAccountHorizNodeCompose = (
      node: IProfitLossSheetAccountNode,
    ): IProfitLossSheetAccountNode => {
      const horizontalTotals = A.mapWithIndex(
        (index: number, totalNode: IProfitLossHorizontalDatePeriodNode) =>
          this.previousPeriodAccountHorizNodeCompose(node)(totalNode, index),
      )(node.horizontalTotals);
      return assoc('horizontalTotals', horizontalTotals, node);
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
    private assocPreviousPeriodAggregateHorizTotal =
      (node: IProfitLossSheetAccountsNode, index: number) =>
      (totalNode: IProfitLossHorizontalDatePeriodNode) => {
        const total = this.getPPHorizNodesTotalSumation(index, node);

        return assoc(
          'previousPeriod',
          this.getTotalAmountMeta(total),
          totalNode,
        );
      };

    /**
     *
     * @param   {IProfitLossSheetAccountsNode} node
     * @param   {IProfitLossHorizontalDatePeriodNode} horizontalTotalNode -
     * @param   {number} index
     * @returns {IProfitLossHorizontalDatePeriodNode}
     */
    private previousPeriodAggregateHorizNodeCompose =
      (node: IProfitLossSheetAccountsNode) =>
      (
        horizontalTotalNode: IProfitLossHorizontalDatePeriodNode,
        index: number,
      ): IProfitLossHorizontalDatePeriodNode => {
        return flow(
          when(
            this.query.isPreviousPeriodActive,
            this.assocPreviousPeriodHorizNodeFromToDates(
              this.query.displayColumnsBy as IFinancialDatePeriodsUnit,
            ),
          ),
          when(
            this.query.isPreviousPeriodActive,
            this.assocPreviousPeriodAggregateHorizTotal(node, index),
          ),
          when(
            this.query.isPreviousPeriodChangeActive,
            this.assocPreviousPeriodTotalChangeNode,
          ),
          when(
            this.query.isPreviousPeriodPercentageActive,
            this.assocPreviousPeriodTotalPercentageNode,
          ),
        )(horizontalTotalNode) as IProfitLossHorizontalDatePeriodNode;
      };

    /**
     * Assoc previous period to aggregate horizontal nodes.
     * @param {IProfitLossSheetAccountsNode} node
     * @returns
     */
    private assocPreviousPeriodAggregateHorizNode = (
      node: IProfitLossSheetAccountsNode,
    ): IProfitLossSheetAccountsNode => {
      const horizontalTotals = A.mapWithIndex(
        (index: number, totalNode: IProfitLossHorizontalDatePeriodNode) =>
          this.previousPeriodAggregateHorizNodeCompose(node)(totalNode, index),
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
     * @param {index} number
     * @param {} totalNode
     */
    private assocPreviousPeriodEquationHorizTotal =
      (
        accNodes: (IProfitLossSchemaNode | IProfitLossSheetNode)[],
        equation: string,
        index: number,
      ) =>
      (totalNode): IProfitLossSheetNode => {
        const scopes = this.getNodesTableForEvaluating(
          `horizontalTotals[${index}].previousPeriod.amount`,
          accNodes,
        );
        const total = this.evaluateEquation(equation, scopes);

        return assoc(
          'previousPeriod',
          this.getTotalAmountMeta(total),
          totalNode,
        );
      };

    /**
     *
     * @param {IProfitLossSheetNode[]} accNodes -
     * @param {string} equation
     * @param {} horizontalTotalNode
     * @param {number} index
     */
    private previousPeriodEquationHorizNodeCompose =
      (
        accNodes: (IProfitLossSchemaNode | IProfitLossSheetNode)[],
        equation: string,
      ) =>
      (horizontalTotalNode, index: number) => {
        const assocHorizTotal = this.assocPreviousPeriodEquationHorizTotal(
          accNodes,
          equation,
          index,
        );
        return flow(
          when(
            this.query.isPreviousPeriodActive,
            this.assocPreviousPeriodHorizNodeFromToDates(
              this.query.displayColumnsBy as IFinancialDatePeriodsUnit,
            ),
          ),
          when(this.query.isPreviousPeriodActive, assocHorizTotal),
          when(
            this.query.isPreviousPeriodChangeActive,
            this.assocPreviousPeriodTotalChangeNode,
          ),
          when(
            this.query.isPreviousPeriodPercentageActive,
            this.assocPreviousPeriodTotalPercentageNode,
          ),
        )(horizontalTotalNode);
      };

    /**
     * Assoc previous period equation to horizontal nodes.
     * @parma  {IProfitLossSheetNode[]} accNodes -
     * @param  {string} equation
     * @param  {IProfitLossSheetEquationNode} node
     * @return {IProfitLossSheetEquationNode}
     */
    private assocPreviousPeriodEquationHorizNode =
      (
        accNodes: (IProfitLossSchemaNode | IProfitLossSheetNode)[],
        equation: string,
      ) =>
      (node: IProfitLossSheetEquationNode): IProfitLossSheetEquationNode => {
        const horizontalTotals = A.mapWithIndex(
          (index: number, totalNode: IProfitLossHorizontalDatePeriodNode) =>
            this.previousPeriodEquationHorizNodeCompose(accNodes, equation)(
              totalNode,
              index,
            ),
        )(node.horizontalTotals);
        return assoc('horizontalTotals', horizontalTotals, node);
      };
  };
