import React, { useMemo, useCallback } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import { CellTextSpan } from 'components/Datatable/Cells';

import withBalanceSheetDetail from './withBalanceSheetDetail';

import { compose, defaultExpanderReducer, getColumnWidth } from 'utils';

/**
 * Balance sheet table.
 */
function BalanceSheetTable({
  // #withBalanceSheetDetail
  balanceSheetTableRows,
  balanceSheetColumns,
  balanceSheetQuery,
  balanceSheetLoading,

  // #ownProps
  companyName,
}) {
  const { formatMessage } = useIntl();

  const columns = useMemo(
    () => [
      {
        Header: formatMessage({ id: 'account_name' }),
        accessor: (row) => (row.code ? `${row.name} - ${row.code}` : row.name),
        className: 'account_name',
        textOverview: true,
        width: 240,
      },
      ...(balanceSheetQuery.display_columns_type === 'total'
        ? [
            {
              Header: formatMessage({ id: 'total' }),
              accessor: 'total.formatted_amount',
              Cell: CellTextSpan,
              className: 'total',
              width: 140,
            },
          ]
        : []),
      ...(balanceSheetQuery.display_columns_type === 'date_periods'
        ? balanceSheetColumns.map((column, index) => ({
            id: `date_period_${index}`,
            Header: column,
            Cell: CellTextSpan,
            accessor: `total_periods[${index}].formatted_amount`,
            className: classNames('total-period', `total-periods-${index}`),
            width: getColumnWidth(
              balanceSheetTableRows,
              `total_periods.${index}.formatted_amount`,
              { minWidth: 100 },
            ),
          }))
        : []),
    ],
    [balanceSheetQuery, balanceSheetColumns, balanceSheetTableRows, formatMessage],
  );

  // Calculates the default expanded rows of balance sheet table.
  const expandedRows = useMemo(
    () => defaultExpanderReducer(balanceSheetTableRows, 4),
    [balanceSheetTableRows],
  );

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
      sheetType={formatMessage({ id: 'balance_sheet' })}
      fromDate={balanceSheetQuery.from_date}
      toDate={balanceSheetQuery.to_date}
      basis={balanceSheetQuery.basis}
      loading={balanceSheetLoading}
    >
      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={balanceSheetTableRows}
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

export default compose(
  withBalanceSheetDetail(
    ({
      balanceSheetTableRows,
      balanceSheetColumns,
      balanceSheetQuery,
      balanceSheetLoading,
    }) => ({
      balanceSheetTableRows,
      balanceSheetColumns,
      balanceSheetQuery,
      balanceSheetLoading,
    }),
  ),
)(BalanceSheetTable);
