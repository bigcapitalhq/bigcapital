/**
 * Shared report-table test id helpers.
 *
 * Financial statement tables render report rows (accounts, contacts, items,
 * etc.) through the Datatable component. Each row is tagged with a
 * `data-testId` derived from the row type and id so e2e tests can assert a
 * report rendered without relying on css class names.
 *
 * Row data shape (server table row): `{ rowTypes: string[], id?: string|number }`.
 */

const getRowType = (row: any): string => row?.original?.rowTypes?.[0] ?? '';

const getRowId = (row: any): string | number | undefined =>
  row?.original?.id ?? undefined;

/**
 * Returns a `rowTestId` callback producing `<prefix>-row--<type>[--<id>]`.
 * The id segment is omitted when the row has no id (several reports map
 * rows without one).
 */
export const getReportRowTestId =
  (prefix: string) =>
  (row: any): string => {
    const type = getRowType(row);
    const id = getRowId(row);
    return `${prefix}-row--${type}${id !== undefined ? `--${id}` : ''}`;
  };

/**
 * Returns a `cellTestId` callback producing
 * `<prefix>-cell--<type>[--<id>]--<column>`.
 */
export const getReportCellTestId =
  (prefix: string) =>
  (row: any, cell: any): string => {
    const type = getRowType(row);
    const id = getRowId(row);
    const column = cell?.column?.key ?? cell?.column?.id ?? '';
    return `${prefix}-cell--${type}${id !== undefined ? `--${id}` : ''}--${column}`;
  };
