import * as R from 'ramda';
import { get } from 'lodash';
import { IBalanceSheetDataNode } from '@/interfaces';
import { BalanceSheetQuery } from './BalanceSheetQuery';

export const BalanceSheetPercentage = (Base: any) =>
  class extends Base {
    readonly query: BalanceSheetQuery;

    /**
     * Assoc percentage of column to report node.
     * @param   {IBalanceSheetDataNode} node
     * @returns {IBalanceSheetDataNode}
     */
    protected assocReportNodeColumnPercentage = R.curry(
      (
        parentTotal: number,
        node: IBalanceSheetDataNode
      ): IBalanceSheetDataNode => {
        const percentage = this.getPercentageBasis(
          parentTotal,
          node.total.amount
        );
        return R.assoc(
          'percentageColumn',
          this.getPercentageAmountMeta(percentage),
          node
        );
      }
    );

    /**
     * Assoc percentage of row to report node.
     * @param   {IBalanceSheetDataNode} node
     * @returns {IBalanceSheetDataNode}
     */
    protected assocReportNodeRowPercentage = R.curry(
      (
        parentTotal: number,
        node: IBalanceSheetDataNode
      ): IBalanceSheetDataNode => {
        const percenatage = this.getPercentageBasis(
          parentTotal,
          node.total.amount
        );
        return R.assoc(
          'percentageRow',
          this.getPercentageAmountMeta(percenatage),
          node
        );
      }
    );

    /**
     * Assoc percentage of row to horizontal total.
     * @param   {number} parentTotal -
     * @param   {IBalanceSheetDataNode} node
     * @returns {IBalanceSheetDataNode}
     */
    protected assocRowPercentageHorizTotals = R.curry(
      (
        parentTotal: number,
        node: IBalanceSheetDataNode
      ): IBalanceSheetDataNode => {
        const assocRowPercen = this.assocReportNodeRowPercentage(parentTotal);
        const horTotals = R.map(assocRowPercen)(node.horizontalTotals);

        return R.assoc('horizontalTotals', horTotals, node);
      }
    );

    /**
     *
     * @param {} parentNode -
     * @param {} horTotalNode -
     * @param {number} index -
     */
    private assocColumnPercentageHorizTotal = R.curry(
      (parentNode, horTotalNode, index) => {
        const parentTotal = get(
          parentNode,
          `horizontalTotals[${index}].total.amount`,
          0
        );
        return this.assocReportNodeColumnPercentage(parentTotal, horTotalNode);
      }
    );

    /**
     * Assoc column percentage to horizontal totals nodes.
     * @param   {IBalanceSheetDataNode} node
     * @returns {IBalanceSheetDataNode}
     */
    protected assocColumnPercentageHorizTotals = R.curry(
      (
        parentNode: IBalanceSheetDataNode,
        node: IBalanceSheetDataNode
      ): IBalanceSheetDataNode => {
        // Horizontal totals.
        const assocColPerc = this.assocColumnPercentageHorizTotal(parentNode);
        const horTotals = R.addIndex(R.map)(assocColPerc)(
          node.horizontalTotals
        );
        return R.assoc('horizontalTotals', horTotals, node);
      }
    );

    /**
     *
     * @param {number} parentTotal -
     * @param {} node
     * @returns
     */
    protected reportNodeColumnPercentageComposer = R.curry(
      (parentNode, node) => {
        const parentTotal = parentNode.total.amount;

        return R.compose(
          R.when(
            this.isNodeHasHorizoTotals,
            this.assocColumnPercentageHorizTotals(parentNode)
          ),
          this.assocReportNodeColumnPercentage(parentTotal)
        )(node);
      }
    );

    /**
     *
     * @param node
     * @returns
     */
    private reportNodeRowPercentageComposer = (node) => {
      const total = node.total.amount;

      return R.compose(
        R.when(
          this.isNodeHasHorizoTotals,
          this.assocRowPercentageHorizTotals(total)
        ),
        this.assocReportNodeRowPercentage(total)
      )(node);
    };

    /**
     *
     */
    private assocNodeColumnPercentageChildren = (node) => {
      const children = this.mapNodesDeep(
        node.children,
        this.reportNodeColumnPercentageComposer(node)
      );
      return R.assoc('children', children, node);
    };

    /**
     *
     * @param node
     * @returns
     */
    private reportNodeColumnPercentageDeepMap = (node) => {
      const parentTotal = node.total.amount;
      const parentNode = node;

      return R.compose(
        R.when(
          this.isNodeHasHorizoTotals,
          this.assocColumnPercentageHorizTotals(parentNode)
        ),
        this.assocReportNodeColumnPercentage(parentTotal),
        this.assocNodeColumnPercentageChildren
      )(node);
    };

    /**
     *
     * @param   {IBalanceSheetDataNode[]} node
     * @returns {IBalanceSheetDataNode[]}
     */
    private reportColumnsPercentageMapper = (
      nodes: IBalanceSheetDataNode[]
    ): IBalanceSheetDataNode[] => {
      return R.map(this.reportNodeColumnPercentageDeepMap, nodes);
    };

    /**
     *
     * @param nodes
     * @returns
     */
    private reportRowsPercentageMapper = (nodes) => {
      return this.mapNodesDeep(nodes, this.reportNodeRowPercentageComposer);
    };

    /**
     *
     * @param nodes
     * @returns
     */
    protected reportPercentageCompose = (nodes) => {
      return R.compose(
        R.when(
          this.query.isColumnsPercentageActive,
          this.reportColumnsPercentageMapper
        ),
        R.when(
          this.query.isRowsPercentageActive,
          this.reportRowsPercentageMapper
        )
      )(nodes);
    };

    /**
     * Determines whether the given node has horizontal total.
     * @param   {IBalanceSheetDataNode} node
     * @returns {boolean}
     */
    protected isNodeHasHorizoTotals = (
      node: IBalanceSheetDataNode
    ): boolean => {
      return (
        !R.isEmpty(node.horizontalTotals) && !R.isNil(node.horizontalTotals)
      );
    };
  };
