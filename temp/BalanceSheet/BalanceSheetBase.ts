import * as R from 'ramda';
import {
  IBalanceSheetDataNode,
  IBalanceSheetSchemaNode,
} from './BalanceSheet.types';
import { Constructor } from '@/common/types/Constructor';

export const BalanceSheetBase = <T extends Constructor>(Base: T) =>
  class BalanceSheetBase extends Base {
    /**
     * Detarmines the node type of the given schema node.
     * @param {IBalanceSheetStructureSection} node -
     * @param {string} type -
     * @return {boolean}
     */
    public isSchemaNodeType = R.curry(
      (type: string, node: IBalanceSheetSchemaNode): boolean => {
        return node.type === type;
      },
    );

    /**
     * Detarmines the node type of the given schema node.
     * @param {IBalanceSheetStructureSection} node -
     * @param {string} type -
     * @return {boolean}
     */
    public isNodeType = R.curry(
      (type: string, node: IBalanceSheetDataNode): boolean => {
        return node.nodeType === type;
      },
    );

    /**
     * Detarmines the given display columns by type.
     * @param {string} displayColumnsBy
     * @returns {boolean}
     */
    public isDisplayColumnsBy = (displayColumnsBy: string): boolean => {
      return this.query.displayColumnsType === displayColumnsBy;
    };
  };
