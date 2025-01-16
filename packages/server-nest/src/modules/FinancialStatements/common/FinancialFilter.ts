
import { Constructor } from '@/common/types/Constructor';
import { isEmpty } from 'lodash';

export const FinancialFilter = <T extends Constructor>(Base: T) =>
  class extends Base {
    /**
     * Detarmines whether the given node has children.
     * @param   {IBalanceSheetCommonNode} node
     * @returns {boolean}
     */
    public isNodeHasChildren = (node: IFinancialCommonNode): boolean =>
      !isEmpty(node.children);

    /**
     * Detarmines whether the given node has no zero amount.
     * @param   {IBalanceSheetCommonNode} node
     * @returns {boolean}
     */
    public isNodeNoneZero = (node) =>{
      return node.total.amount !== 0;
    }
  };
