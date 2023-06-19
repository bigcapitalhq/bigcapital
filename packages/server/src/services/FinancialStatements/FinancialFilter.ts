
import { isEmpty } from 'lodash';

export const FinancialFilter = (Base) =>
  class extends Base {
    /**
     * Determines whether the given node has children.
     * @param   {IBalanceSheetCommonNode} node
     * @returns {boolean}
     */
    protected isNodeHasChildren = (node: IBalanceSheetCommonNode): boolean =>
      !isEmpty(node.children);

    /**
     * Determines whether the given node has no zero amount.
     * @param   {IBalanceSheetCommonNode} node
     * @returns {boolean}
     */
    public isNodeNoneZero = (node) =>{
      return node.total.amount !== 0;
    }
  };
