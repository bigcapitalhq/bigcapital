import { isNegativeAmount } from '@bigcapital/utils';
import React from 'react';
import intl from 'react-intl-universal';
import { getReportCellTestId } from '../reportTestIds';
import type { BalanceSheetTableResponse } from '@bigcapital/sdk-ts';
import type { BP_TableProps } from '@bigcapitalhq/blueprintjs-react-table';
import { MoneyDisplay } from '@/components/Money/MoneyDisplay';
import { getColumnWidth } from '@/utils';

type ReportTable = BalanceSheetTableResponse['table'];
export type BalanceSheetRow = ReportTable['rows'][number];
type ReportColumn = NonNullable<
  ReportTable['columns'][number]['children']
>[number];
type TableColumn = BP_TableProps<BalanceSheetRow>['columns'][number];

const cellTestId = getReportCellTestId('balance-sheet');

export function dynamicColumns(
  columns: ReportColumn[],
  rows: BalanceSheetRow[],
) {
  function mapColumn(column: ReportColumn, parentKey = ''): TableColumn {
    const { key, label, children, cellIndex } = column;
    if (children?.length) {
      return {
        id: `group-${key}`,
        header: label,
        meta: { headCellClassName: 'align-center' },
        columns: children.map((child) => mapColumn(child, key)),
      };
    }

    const isName = key === 'name';
    const isPeriod = (parentKey || key).startsWith('date-range');
    const size = getColumnWidth(
      rows,
      `cells[${cellIndex}].value`,
      {
        magicSpacing: 12,
        minWidth: isName ? 300 : 100,
      },
      isPeriod && !parentKey ? undefined : label,
    );
    return {
      // Period groups repeat the same comparison keys. Only summary leaves
      // use their API key as a sortable column ID.
      id: isPeriod ? `${parentKey || key}-${cellIndex}` : key,
      accessorFn: (row) =>
        cellIndex === undefined ? '' : row.cells[cellIndex]?.value,
      size,
      enableSorting: !isPeriod,
      meta: {
        headCellClassName: isName ? 'name' : 'align-right',
        bodyCellClassName: isName ? 'name' : 'align-right',
      },
      header: ({ header, column, table }) => {
        if (header.isPlaceholder) return null;
        const sorted = column.getIsSorted();
        const allExpanded = isName && table.getIsAllRowsExpanded();
        return (
          <>
            {isName && (
              <button
                type="button"
                className="expand-all"
                aria-label={intl.get(
                  allExpanded ? 'accounts.collapse_all' : 'accounts.expand_all',
                )}
                aria-expanded={allExpanded}
                onClick={table.getToggleAllRowsExpandedHandler()}
              />
            )}
            {column.getCanSort() ? (
              <button
                type="button"
                className="sort-label"
                onClick={column.getToggleSortingHandler()}
              >
                {label}
                {sorted && (
                  <span className={`sort-icon sort-icon--${sorted}`} />
                )}
              </button>
            ) : (
              label
            )}
          </>
        );
      },
      cell: ({ row, getValue }) => {
        const value = getValue<string>();
        return (
          <span
            data-testId={cellTestId(row, { column: { key } })}
            className={
              !isName && isNegativeAmount(value)
                ? 'is-negative-amount'
                : undefined
            }
          >
            {isName ? value : <MoneyDisplay>{value}</MoneyDisplay>}
          </span>
        );
      },
    };
  }

  return columns.map((column) => mapColumn(column));
}
