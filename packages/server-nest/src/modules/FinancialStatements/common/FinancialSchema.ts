import * as R from 'ramda';
import { FinancialSheetStructure } from './FinancialSheetStructure';
import { Constructor } from '@/common/types/Constructor';

export const FinancialSchema = <T extends Constructor>(Base: T) =>
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
    publicgetSchemaNodeById = (id: string | number) => {
      const schema = this.getSchema();

      return this.findNodeDeep(schema, (node) => node.id === id);
    };
  };
