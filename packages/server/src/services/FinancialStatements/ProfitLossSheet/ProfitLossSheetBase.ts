import * as R from 'ramda';
import { TOTAL_NODE_TYPES } from './constants';

export const ProfitLossSheetBase = (Base) =>
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

    protected isNodeTypeIn = R.curry((types: string[], node) => {
      return types.indexOf(node.nodeType) !== -1;
    });

    /**
     * 
     */
    protected findNodeById = R.curry((id, nodes) => {
      return this.findNodeDeep(nodes, (node) => node.id === id);
    });

    isNodeTotal = (node) => {
      return this.isNodeTypeIn(TOTAL_NODE_TYPES, node);
    }
  };
