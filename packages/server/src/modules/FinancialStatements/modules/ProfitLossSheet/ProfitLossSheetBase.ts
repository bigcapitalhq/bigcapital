import { TOTAL_NODE_TYPES } from './constants';
import { FinancialSheet } from '../../common/FinancialSheet';
import { GConstructor } from '@/common/types/Constructor';

export const ProfitLossSheetBase = <T extends GConstructor<FinancialSheet>>(
  Base: T,
) =>
  class extends Base {
    protected findNodeDeep: (nodes, callback) => any;

    /**
     *
     * @param type
     * @param node
     * @returns
     */
    public isNodeType = (type: string) => (node) => {
      return node.nodeType === type;
    };

    /**
     *
     */
    protected isNodeTypeIn = (types: string[], node) => {
      return types.indexOf(node.nodeType) !== -1;
    };

    /**
     *
     */
    protected findNodeById = (id, nodes) => {
      return this.findNodeDeep(nodes, (node) => node.id === id);
    };

    /**
     *
     * @param node
     * @returns
     */
    isNodeTotal = (node) => {
      return this.isNodeTypeIn(TOTAL_NODE_TYPES, node);
    };
  };
