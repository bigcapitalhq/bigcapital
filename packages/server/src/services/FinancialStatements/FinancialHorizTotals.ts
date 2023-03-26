import * as R from 'ramda';
import { get, isEmpty } from 'lodash';

export const FinancialHorizTotals = (Base) =>
  class extends Base {
    /**
     *
     */
    protected assocNodePercentage = R.curry(
      (assocPath, parentTotal: number, node: any) => {
        const percentage = this.getPercentageBasis(
          parentTotal,
          node.total.amount
        );
        return R.assoc(
          assocPath,
          this.getPercentageAmountMeta(percentage),
          node
        );
      }
    );

    /**
     *
     * @param {} parentNode -
     * @param {} horTotalNode -
     * @param {number} index -
     */
    protected assocPercentageHorizTotal = R.curry(
      (assocPercentagePath: string, parentNode, horTotalNode, index) => {
        const parentTotal = get(
          parentNode,
          `horizontalTotals[${index}].total.amount`,
          0
        );
        return this.assocNodePercentage(
          assocPercentagePath,
          parentTotal,
          horTotalNode
        );
      }
    );

    /**
     *
     * @param assocPercentagePath
     * @param parentNode
     * @param node
     * @returns
     */
    protected assocPercentageHorizTotals = R.curry(
      (assocPercentagePath: string, parentNode, node) => {
        const assocColPerc = this.assocPercentageHorizTotal(
          assocPercentagePath,
          parentNode
        );
        return R.addIndex(R.map)(assocColPerc)(node.horizontalTotals);
      }
    );

    /**
     *
     */
    assocRowPercentageHorizTotal = R.curry(
      (assocPercentagePath: string, node, horizTotalNode) => {
        return this.assocNodePercentage(
          assocPercentagePath,
          node.total.amount,
          horizTotalNode
        );
      }
    );

    /**
     *
     */
    protected assocHorizontalPercentageTotals = R.curry(
      (assocPercentagePath: string, node) => {
        const assocColPerc = this.assocRowPercentageHorizTotal(
          assocPercentagePath,
          node
        );

        return R.map(assocColPerc)(node.horizontalTotals);
      }
    );

    /**
     * 
     * @param node 
     * @returns 
     */
    protected isNodeHasHorizTotals = (node) => {
      return !isEmpty(node.horizontalTotals);
    };
  };
