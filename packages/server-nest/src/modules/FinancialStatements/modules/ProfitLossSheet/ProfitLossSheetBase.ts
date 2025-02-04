import * as R from 'ramda';
import { TOTAL_NODE_TYPES } from './constants';
import { FinancialSheet } from '../../common/FinancialSheet';
import { GConstructor } from '@/common/types/Constructor';

export const ProfitLossSheetBase = <T extends GConstructor<FinancialSheet>>(
  Base: T,
) =>
  class extends Base {
    /**
     *
     * @param type
     * @param node
     * @returns
     */
    public isNodeType = R.curry((type: string, node) => {
      return node.nodeType === type;
    });

    /**
     * 
     */
    protected isNodeTypeIn = R.curry((types: string[], node) => {
      return types.indexOf(node.nodeType) !== -1;
    });

    /**
     *
     */
    protected findNodeById = R.curry((id, nodes) => {
      return this.findNodeDeep(nodes, (node) => node.id === id);
    });

    /**
     * 
     * @param node 
     * @returns 
     */
    isNodeTotal = (node) => {
      return this.isNodeTypeIn(TOTAL_NODE_TYPES, node);
    };
  };
