import { flow } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import { get, isNil, isEmpty } from 'lodash';
import { assoc, when } from '@/common/fp';
import { BalanceSheetQuery } from './BalanceSheetQuery';
import {
  IBalanceSheetDataNode,
  IBalanceSheetTotal,
} from './BalanceSheet.types';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialSheet } from '../../common/FinancialSheet';

export const BalanceSheetPercentage = <T extends GConstructor<FinancialSheet>>(
  Base: T,
) =>
  class extends Base {
    readonly query: BalanceSheetQuery;

    public mapNodesDeep: (nodes, callback) => any;

    /**
     * Assoc percentage of column to report node.
     * @param {IBalanceSheetDataNode} node
     * @returns {IBalanceSheetDataNode}
     */
    public assocReportNodeColumnPercentage =
      (parentTotal: number) =>
      (node: any): any => {
        const percentage = this.getPercentageBasis(
          parentTotal,
          node.total.amount,
        );
        return assoc(
          'percentageColumn',
          this.getPercentageAmountMeta(percentage),
          node,
        );
      };

    /**
     * Assoc percentage of row to report node.
     * @param   {IBalanceSheetDataNode} node
     * @returns {IBalanceSheetDataNode}
     */
    public assocReportNodeRowPercentage =
      (parentTotal: number) =>
      (node: any): any => {
        const percenatage = this.getPercentageBasis(
          parentTotal,
          node.total.amount,
        );
        return assoc(
          'percentageRow',
          this.getPercentageAmountMeta(percenatage),
          node,
        );
      };

    /**
     * Assoc percentage of row to horizontal total.
     * @param   {number} parentTotal -
     * @param   {IBalanceSheetDataNode} node
     * @returns {IBalanceSheetDataNode}
     */
    public assocRowPercentageHorizTotals =
      (parentTotal: number) =>
      (node: any): IBalanceSheetDataNode => {
        const assocRowPercen = this.assocReportNodeRowPercentage(parentTotal);
        const horTotals = A.map(assocRowPercen)(node.horizontalTotals);

        return assoc('horizontalTotals', horTotals, node);
      };

    /**
     *
     * @param {} parentNode -
     * @param {} horTotalNode -
     * @param {number} index -
     */
    private assocColumnPercentageHorizTotal =
      (parentNode: IBalanceSheetDataNode) =>
      (horTotalNode: IBalanceSheetTotal, index: number): IBalanceSheetTotal => {
        const parentTotal = get(
          parentNode,
          `horizontalTotals[${index}].total.amount`,
          0,
        );
        return this.assocReportNodeColumnPercentage(parentTotal)(horTotalNode);
      };

    /**
     * Assoc column percentage to horizontal totals nodes.
     * @param   {IBalanceSheetDataNode} node
     * @returns {IBalanceSheetDataNode}
     */
    public assocColumnPercentageHorizTotals =
      (parentNode: IBalanceSheetDataNode) =>
      (node: IBalanceSheetDataNode): IBalanceSheetDataNode => {
        // Horizontal totals.
        const assocColPerc = this.assocColumnPercentageHorizTotal(parentNode);
        const horTotals = A.mapWithIndex(
          (index: number, totalNode: IBalanceSheetTotal) =>
            assocColPerc(totalNode, index),
        )(node.horizontalTotals) as IBalanceSheetTotal[];
        return assoc('horizontalTotals', horTotals, node);
      };

    /**
     *
     * @param {number} parentTotal -
     * @param {} node
     * @returns
     */
    public reportNodeColumnPercentageComposer =
      (parentNode: IBalanceSheetDataNode) =>
      (node: IBalanceSheetDataNode): IBalanceSheetDataNode => {
        const parentTotal = parentNode.total.amount;

        return flow(
          this.assocReportNodeColumnPercentage(parentTotal),
          when(
            this.isNodeHasHorizoTotals,
            this.assocColumnPercentageHorizTotals(parentNode),
          ),
        )(node);
      };

    /**
     *
     * @param node
     * @returns
     */
    private reportNodeRowPercentageComposer = (node: IBalanceSheetDataNode) => {
      const total = node.total.amount;

      return flow(
        this.assocReportNodeRowPercentage(total),
        when(
          this.isNodeHasHorizoTotals,
          this.assocRowPercentageHorizTotals(total),
        ),
      )(node);
    };

    /**
     *
     */
    private assocNodeColumnPercentageChildren = (node: any): any => {
      const children = this.mapNodesDeep(
        node.children,
        this.reportNodeColumnPercentageComposer(node),
      );
      return assoc('children', children, node);
    };

    /**
     *
     * @param node
     * @returns
     */
    private reportNodeColumnPercentageDeepMap = (
      node: IBalanceSheetDataNode,
    ) => {
      const parentTotal = node.total.amount;
      const parentNode = node;

      return flow(
        this.assocNodeColumnPercentageChildren,
        this.assocReportNodeColumnPercentage(parentTotal),
        when(
          this.isNodeHasHorizoTotals,
          this.assocColumnPercentageHorizTotals(parentNode),
        ),
      )(node);
    };

    /**
     *
     * @param   {IBalanceSheetDataNode[]} node
     * @returns {IBalanceSheetDataNode[]}
     */
    private reportColumnsPercentageMapper = (
      nodes: IBalanceSheetDataNode[],
    ): IBalanceSheetDataNode[] => {
      return A.map(this.reportNodeColumnPercentageDeepMap)(nodes);
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
    public reportPercentageCompose = (nodes) => {
      return flow(
        when(
          this.query.isRowsPercentageActive,
          this.reportRowsPercentageMapper,
        ),
        when(
          this.query.isColumnsPercentageActive,
          this.reportColumnsPercentageMapper,
        ),
      )(nodes);
    };

    /**
     * Detarmines whether the given node has horizontal total.
     * @param   {IBalanceSheetDataNode} node
     * @returns {boolean}
     */
    public isNodeHasHorizoTotals = (node: IBalanceSheetDataNode): boolean => {
      return !isEmpty(node.horizontalTotals) && !isNil(node.horizontalTotals);
    };
  };
