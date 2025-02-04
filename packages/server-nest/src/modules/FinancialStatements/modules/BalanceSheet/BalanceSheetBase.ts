import * as R from 'ramda';
import {
  IBalanceSheetDataNode,
  IBalanceSheetSchemaNode,
} from './BalanceSheet.types';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialSheet } from '../../common/FinancialSheet';

export const BalanceSheetBase = <T extends GConstructor<FinancialSheet>>(
  Base: T,
) =>
  class BalanceSheetBase extends Base {
    /**
     * Determines the node type of the given schema node.
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
     * Determines the node type of the given schema node.
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
     * Determines the given display columns by type.
     * @param {string} displayColumnsBy
     * @returns {boolean}
     */
    public isDisplayColumnsBy = (displayColumnsBy: string): boolean => {
      return this.query.displayColumnsType === displayColumnsBy;
    };
  };
