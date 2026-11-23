import { BP_Table as BlueprintTable } from '@bigcapitalhq/blueprintjs-react-table';
import { functionalUpdate } from '@tanstack/react-table';
import clsx from 'classnames';
import React, { useMemo, useState } from 'react';
import intl from 'react-intl-universal';
import '@bigcapitalhq/blueprintjs-react-table/styles.css';
import { getReportRowTestId } from '../reportTestIds';
import { useFinancialReportSorting } from '../useReportSorting';
import { useBalanceSheetContext } from './BalanceSheetProvider';
import { dynamicColumns } from './dynamicColumns';
import type { BalanceSheetRow } from './dynamicColumns';
import { FinancialSheet } from '@/components';
import { CLASSES } from '@/constants/classes';
import { defaultExpanderReducer, tableRowTypesToClassnames } from '@/utils';
import '@/style/components/DataTable/TableConstrant.scss';

const EMPTY_ROWS: BalanceSheetRow[] = [];
const getSubRows = (row: BalanceSheetRow) => row.children;
const rowTestId = getReportRowTestId('balance-sheet');
const expanderProps = {
  className: 'expand-toggle',
  'data-testId': 'expand-toggle',
};

export function BalanceSheetTable({ companyName }: { companyName: string }) {
  const { balanceSheet, pageQuery, setPageQuery } = useBalanceSheetContext();
  const table = balanceSheet?.table;
  const rows = table?.rows ?? EMPTY_ROWS;
  const [hoveredRow, setHoveredRow] = useState<string>();
  const columns = useMemo(
    () => dynamicColumns(table?.columns ?? [], rows),
    [table, rows],
  );
  const expanded = useMemo(
    () => Object.fromEntries(Object.entries(defaultExpanderReducer(rows, 3))),
    [rows],
  );
  const { initialSortBy, handleFetchData } = useFinancialReportSorting({
    pageQuery,
    setPageQuery,
  });

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={intl.get('balance_sheet')}
      dateText={
        balanceSheet?.meta?.formattedDateRange ??
        balanceSheet?.meta?.formattedAsDate
      }
      basis={balanceSheet?.query.basis}
    >
      <BlueprintTable<BalanceSheetRow>
        htmlProps={{ className: CLASSES.TABLE_CONSTRANT }}
        data={rows}
        columns={columns}
        getSubRows={getSubRows}
        initialExpandedRows={expanded}
        rowExpanderButtonProps={expanderProps}
        rowHeight={28}
        enableRowHeader={false}
        numFrozenColumns={1}
        selectionModes={[]}
        enableSorting
        manualSorting
        sortDescFirst={false}
        enableMultiSort={false}
        state={{ sorting: initialSortBy }}
        onSortingChange={(update) =>
          handleFetchData({ sortBy: functionalUpdate(update, initialSortBy) })
        }
        getCellProps={({ row, column }) => ({
          className: clsx(tableRowTypesToClassnames(row), {
            'is-expanded': row.getCanExpand() && row.getIsExpanded(),
            'is-hovered': row.id === hoveredRow,
          }),
          style: { '--row-depth': row.depth } as React.CSSProperties,
          'data-testId': column.id === 'name' ? rowTestId(row) : undefined,
          tabIndex: 0,
          onMouseEnter: () => setHoveredRow(row.id),
          onMouseLeave: () => setHoveredRow(undefined),
        })}
      />
      {rows.length === 0 && (
        <div className="no-results">
          {intl.get('there_is_no_results_in_the_table')}
        </div>
      )}
    </FinancialSheet>
  );
}
