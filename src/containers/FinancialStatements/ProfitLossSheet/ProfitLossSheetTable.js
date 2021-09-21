import React, { useMemo, useCallback } from 'react';
import { FormattedMessage as T } from 'components';
import intl from 'react-intl-universal';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import { CellTextSpan } from 'components/Datatable/Cells';

import { defaultExpanderReducer, getColumnWidth } from 'utils';
import { useProfitLossSheetContext } from './ProfitLossProvider';

export default function ProfitLossSheetTable({
  // #ownProps
  companyName,
}) {
  

  // Profit/Loss sheet context.
  const {
    profitLossSheet: { tableRows, query, columns },
    isLoading
  } = useProfitLossSheetContext();

  const tableColumns = useMemo(
    () => [
      {
        Header: intl.get('account'),
        accessor: (row) => (row.code ? `${row.name} - ${row.code}` : row.name),
        className: 'name',
        textOverview: true,
        width: 240,
      },
      ...(query.display_columns_type === 'total'
        ? [
            {
              Header: intl.get('total'),
              Cell: CellTextSpan,
              accessor: 'total.formatted_amount',
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
            width: getColumnWidth(
              tableRows,
              `total_periods.${index}.formatted_amount`,
              { minWidth: 100 },
            ),
            className: 'total-period',
          }))
        : []),
    ],
    [
      query.display_columns_type,
      tableRows,
      columns,
    ],
  );

  // Retrieve default expanded rows of balance sheet.
  const expandedRows = useMemo(
    () => defaultExpanderReducer(tableRows, 3),
    [tableRows],
  );

  // Retrieve conditional datatable row classnames.
  const rowClassNames = useCallback((row) => {
    const { original } = row;
    const rowTypes = Array.isArray(original.rowTypes) ? original.rowTypes : [];

    return {
      ...rowTypes.reduce((acc, rowType) => {
        acc[`row_type--${rowType}`] = rowType;
        return acc;
      }, {}),
    };
  }, []);

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={<T id={'profit_loss_sheet'} />}
      fromDate={query.from_date}
      toDate={query.to_date}
      name="profit-loss-sheet"
      loading={isLoading}
      basis={query.basis}
    >
      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={tableColumns}
        data={tableRows}
        noInitialFetch={true}
        expanded={expandedRows}
        rowClassNames={rowClassNames}
        expandable={true}
        expandToggleColumn={1}
        
        sticky={true}
      />
    </FinancialSheet>
  );
}
