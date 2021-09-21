import React, { useMemo, useCallback } from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import { CellTextSpan } from 'components/Datatable/Cells';
import { useBalanceSheetContext } from './BalanceSheetProvider';

import { defaultExpanderReducer, getColumnWidth } from 'utils';

/**
 * Balance sheet table.
 */
export default function BalanceSheetTable({
  // #ownProps
  companyName,
}) {
  

  // Balance sheet context.
  const {
    balanceSheet: { tableRows, columns, query },
    isLoading,
  } = useBalanceSheetContext();

  const tableColumns = useMemo(
    () => [
      {
        Header: intl.get('account_name'),
        accessor: (row) => (row.code ? `${row.name} - ${row.code}` : row.name),
        className: 'account_name',
        textOverview: true,
        width: 240,
      },
      ...(query.display_columns_type === 'total'
        ? [
            {
              Header: intl.get('total'),
              accessor: 'total.formatted_amount',
              Cell: CellTextSpan,
              className: 'total',
              width: 140,
            },
          ]
        : []),
      ...(query.display_columns_type === 'date_periods'
        ? columns.map((column, index) => ({
            id: `date_period_${index}`,
            Header: column,
            Cell: CellTextSpan,
            accessor: `total_periods[${index}].formatted_amount`,
            className: classNames('total-period', `total-periods-${index}`),
            width: getColumnWidth(
              tableRows,
              `total_periods.${index}.formatted_amount`,
              { minWidth: 100 },
            ),
          }))
        : []),
    ],
    [query, columns, tableRows],
  );

  // Calculates the default expanded rows of balance sheet table.
  const expandedRows = useMemo(() => defaultExpanderReducer(tableRows, 4), [tableRows]);

  const rowClassNames = useCallback((row) => {
    const { original } = row;
    const rowTypes = Array.isArray(original.row_types)
      ? original.row_types
      : [original.row_types];

    return {
      ...rowTypes.reduce((acc, rowType) => {
        acc[`row_type--${rowType}`] = rowType;
        return acc;
      }, {}),
    };
  }, []);

  return (
    <FinancialSheet
      name="balance-sheet"
      companyName={companyName}
      sheetType={intl.get('balance_sheet')}
      fromDate={query.from_date}
      toDate={query.to_date}
      basis={query.basis}
      loading={isLoading}
    >
      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={tableColumns}
        data={tableRows}
        rowClassNames={rowClassNames}
        noInitialFetch={true}
        expandable={true}
        expanded={expandedRows}
        expandToggleColumn={1}
        expandColumnSpace={0.8}
        // sticky={true}
      />
    </FinancialSheet>
  );
}
