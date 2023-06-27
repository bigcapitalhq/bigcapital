import * as R from 'ramda';
import { IBalanceSheetDataNode, IBalanceSheetSchemaNode } from '@/interfaces';

export const BalanceSheetBase = (Base) =>
  class extends Base {
    /**
     * Determines the node type of the given schema node.
     * @param  {IBalanceSheetStructureSection} node -
     * @param  {string} type -
     * @return {boolean}
     */
    protected isSchemaNodeType = R.curry(
      (type: string, node: IBalanceSheetSchemaNode): boolean => {
        return node.type === type;
      }
    );

    isNodeType = R.curry(
      (type: string, node: IBalanceSheetDataNode): boolean => {
        return node.nodeType === type;
      }
    );

    /**
     * Determines the given display columns by type.
     * @param   {string} displayColumnsBy
     * @returns {boolean}
     */
    protected isDisplayColumnsBy = (displayColumnsBy: string): boolean => {
      return this.query.displayColumnsType === displayColumnsBy;
    };
  };
