import * as R from 'ramda';
import { get, isEmpty } from 'lodash';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialSheet } from './FinancialSheet';

export const FinancialHorizTotals = <T extends GConstructor<FinancialSheet>>(
  Base: T,
) =>
  class FinancialHorizTotals extends Base {
    /**
     *
     */
    public assocNodePercentage = R.curry(
      (assocPath, parentTotal: number, node: any) => {
        const percentage = this.getPercentageBasis(
          parentTotal,
          node.total.amount,
        );
        return R.assoc(
          assocPath,
          this.getPercentageAmountMeta(percentage),
          node,
        );
      },
    );

    /**
     *
     * @param {} parentNode -
     * @param {} horTotalNode -
     * @param {number} index -
     */
    public assocPercentageHorizTotal = R.curry(
      (assocPercentagePath: string, parentNode, horTotalNode, index) => {
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
      },
    );

    /**
     *
     * @param assocPercentagePath
     * @param parentNode
     * @param node
     * @returns
     */
    public assocPercentageHorizTotals = R.curry(
      (assocPercentagePath: string, parentNode, node) => {
        const assocColPerc = this.assocPercentageHorizTotal(
          assocPercentagePath,
          parentNode,
        );
        return R.addIndex(R.map)(assocColPerc)(node.horizontalTotals);
      },
    );

    /**
     *
     */
    assocRowPercentageHorizTotal = R.curry(
      (assocPercentagePath: string, node, horizTotalNode) => {
        return this.assocNodePercentage(
          assocPercentagePath,
          node.total.amount,
          horizTotalNode,
        );
      },
    );

    /**
     *
     */
    public assocHorizontalPercentageTotals = R.curry(
      (assocPercentagePath: string, node) => {
        const assocColPerc = this.assocRowPercentageHorizTotal(
          assocPercentagePath,
          node,
        );

        return R.map(assocColPerc)(node.horizontalTotals);
      },
    );

    /**
     *
     * @param node
     * @returns
     */
    public isNodeHasHorizTotals = (node) => {
      return !isEmpty(node.horizontalTotals);
    };
  };
