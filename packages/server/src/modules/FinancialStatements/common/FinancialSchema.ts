import * as R from 'ramda';
import { FinancialSheetStructure } from './FinancialSheetStructure';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialSheet } from './FinancialSheet';

export const FinancialSchema = <T extends GConstructor<FinancialSheet>>(
  Base: T,
) =>
  class FinancialSchema extends FinancialSheetStructure(Base) {
    /**
     *
     * @returns
     */
    getSchema() {
      return [];
    }

    /**
     *
     * @param {string|number} id
     * @returns
     */
    public getSchemaNodeById = (id: string | number) => {
      const schema = this.getSchema();

      return this.findNodeDeep(schema, (node) => node.id === id);
    };
  };
