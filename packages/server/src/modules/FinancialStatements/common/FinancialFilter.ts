// @ts-nocheck
import { GConstructor } from '@/common/types/Constructor';
import { isEmpty } from 'lodash';
import { FinancialSheet } from './FinancialSheet';
import { IFinancialCommonNode } from '../types/Report.types';

export const FinancialFilter = <T extends GConstructor<FinancialSheet>>(
  Base: T,
) =>
  class extends Base {
    /**
     * Detarmines whether the given node has children.
     * @param {IBalanceSheetCommonNode} node
     * @returns {boolean}
     */
    public isNodeHasChildren = (node: IFinancialCommonNode): boolean =>
      !isEmpty(node.children);

    /**
     * Detarmines whether the given node has no zero amount.
     * @param   {IBalanceSheetCommonNode} node
     * @returns {boolean}
     */
    public isNodeNoneZero = (node) => {
      return node.total.amount !== 0;
    };
  };
