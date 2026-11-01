import * as A from 'fp-ts/Array';
import { get, isEmpty } from 'lodash';
import { GConstructor } from '@/common/types/Constructor';
import { assoc } from '@/common/fp';
import { FinancialSheet } from './FinancialSheet';

export const FinancialHorizTotals = <T extends GConstructor<FinancialSheet>>(
  Base: T,
) =>
  class FinancialHorizTotals extends Base {
    /**
     * Associate percentage to the given node.
     */
    public assocNodePercentage = (
      assocPath: string,
      parentTotal: number,
      node: any,
    ) => {
      const percentage = this.getPercentageBasis(
        parentTotal,
        node.total.amount,
      );
      return assoc(assocPath, this.getPercentageAmountMeta(percentage), node);
    };

    /**
     * Associate horizontal percentage total to the given node.
     * @param {} parentNode -
     * @param {} horTotalNode -
     * @param {number} index -
     */
    public assocPercentageHorizTotal = (
      assocPercentagePath: string,
      parentNode,
      horTotalNode,
      index: number,
    ) => {
      const parentTotal = get(
        parentNode,
        `horizontalTotals[${index}].total.amount`,
        0,
      );
      return this.assocNodePercentage(
        assocPercentagePath,
        parentTotal,
        horTotalNode,
      );
    };

    /**
     *
     * @param assocPercentagePath
     * @param parentNode
     * @param node
     * @returns
     */
    public assocPercentageHorizTotals = (
      assocPercentagePath: string,
      parentNode,
      node,
    ) => {
      return A.mapWithIndex((index: number, horTotalNode) =>
        this.assocPercentageHorizTotal(
          assocPercentagePath,
          parentNode,
          horTotalNode,
          index,
        ),
      )(node.horizontalTotals);
    };

    /**
     *
     */
    assocRowPercentageHorizTotal = (
      assocPercentagePath: string,
      node,
      horizTotalNode,
    ) => {
      return this.assocNodePercentage(
        assocPercentagePath,
        node.total.amount,
        horizTotalNode,
      );
    };

    /**
     *
     * @param assocPercentagePath
     * @param node
     * @returns
     */
    public assocHorizontalPercentageTotals = (
      assocPercentagePath: string,
      node,
    ) => {
      return A.map((horTotalNode) =>
        this.assocRowPercentageHorizTotal(
          assocPercentagePath,
          node,
          horTotalNode,
        ),
      )(node.horizontalTotals);
    };

    /**
     *
     * @param node
     * @returns
     */
    public isNodeHasHorizTotals = (node) => {
      return !isEmpty(node.horizontalTotals);
    };
  };
