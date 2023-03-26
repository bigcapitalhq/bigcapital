import * as R from 'ramda';
import { FinancialSheetStructure } from './FinancialSheetStructure';

export const FinancialSchema = (Base) =>
  class extends R.compose(FinancialSheetStructure)(Base) {
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
    getSchemaNodeById = (id: string | number) => {
      const schema = this.getSchema();

      return this.findNodeDeep(schema, (node) => node.id === id);
    };
  };
