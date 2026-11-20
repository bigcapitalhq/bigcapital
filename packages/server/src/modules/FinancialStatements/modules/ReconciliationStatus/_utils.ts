import { ITableCell } from '../../types/Table.types';
import { ReconciliationStatusTableDataDto } from './ReconciliationStatusResponse.dto';

/**
 * Applies the given transform to every cell value of the table.
 * @param {ReconciliationStatusTableDataDto} table - The table data.
 * @param {(cell: ITableCell) => string} transform - The cell value transform.
 * @returns {ReconciliationStatusTableDataDto}
 */
export const mapCellValues = (
  table: ReconciliationStatusTableDataDto,
  transform: (cell: ITableCell) => string,
): ReconciliationStatusTableDataDto => {
  return {
    ...table,
    rows: table.rows.map((row) => ({
      ...row,
      cells: row.cells.map((cell) => ({ ...cell, value: transform(cell) })),
    })),
  };
};
