import * as R from 'ramda';
import { isEmpty, clone, cloneDeep, omit } from 'lodash';
import { increment } from '@/utils/increment';
import { ITableRow, ITableColumn } from '../types/Table.types';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialSheetStructure } from './FinancialSheetStructure';
import { I18nService } from 'nestjs-i18n';
import { FinancialSheet } from './FinancialSheet';

enum IROW_TYPE {
  TOTAL = 'TOTAL',
}

export const FinancialTable = <T extends GConstructor<FinancialSheet>>(
  Base: T
) =>
  class extends R.pipe(FinancialSheetStructure)(Base) {
    public readonly i18n: I18nService;

    /**
     * Table columns cell indexing.
     * @param   {ITableColumn[]} columns
     * @returns {ITableColumn[]}
     */
    public tableColumnsCellIndexing = (
      columns: ITableColumn[],
    ): ITableColumn[] => {
      const cellIndex = increment(-1);

      return this.mapNodesDeep(columns, (column) => {
        return isEmpty(column.children)
          ? R.assoc('cellIndex', cellIndex(), column)
          : column;
      });
    };

    public addTotalRow = (node: ITableRow) => {
      const clonedNode = clone(node);

      if (clonedNode.children) {
        const cells = cloneDeep(node.cells);
        cells[0].value = this.i18n.t('financial_sheet.total_row', {
          args: {
            value: cells[0].value,
          },
        });

        clonedNode.children.push({
          ...omit(clonedNode, 'children'),
          cells,
          rowTypes: [IROW_TYPE.TOTAL],
        });
      }
      return clonedNode;
    };

    public addTotalRows = (nodes: ITableRow[]) => {
      return this.mapNodesDeep(nodes, this.addTotalRow);
    };
  };
