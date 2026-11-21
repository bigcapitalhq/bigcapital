import { ITableCell } from '../../types/Table.types';
import type { I18nService } from 'nestjs-i18n';
import { ReconciliationReportStatus } from './ReconciliationStatusQuery.dto';
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

export function getReconciliationReportStatusLabel(
  i18n: I18nService,
  status: ReconciliationReportStatus,
): string {
  return i18n.t(
    status === ReconciliationReportStatus.Reconciled
      ? 'reconciliation_status.reconciled'
      : 'reconciliation_status.unreconciled',
  );
}

export function localizeReconciliationStatusCell(
  i18n: I18nService,
  { key, value }: ITableCell,
): string {
  if (
    key === 'status' &&
    (value === ReconciliationReportStatus.Reconciled ||
      value === ReconciliationReportStatus.Unreconciled)
  ) {
    return getReconciliationReportStatusLabel(i18n, value);
  }
  return value;
}
