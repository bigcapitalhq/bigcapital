import React, { useMemo, useCallback } from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import Money from 'components/Money';

import { compose, defaultExpanderReducer, getColumnWidth } from 'utils';
import withProfitLossDetail from './withProfitLoss';

function ProfitLossSheetTable({
  // #withProfitLoss
  profitLossTableRows,
  profitLossQuery,
  profitLossColumns,
  profitLossSheetLoading,

  // #ownProps
  companyName,
}) {
  const { formatMessage } = useIntl();

  const columns = useMemo(
    () => [
      {
        Header: formatMessage({ id: 'account' }),
        accessor: (row) => (row.code ? `${row.name} - ${row.code}` : row.name),
        className: 'name',
        width: 240,
      },
      ...(profitLossQuery.display_columns_type === 'total'
        ? [
            {
              Header: formatMessage({ id: 'total' }),
              accessor: 'total.formatted_amount',
              className: 'total',
              width: 140,
            },
          ]
        : []),
      ...(profitLossQuery.display_columns_type === 'date_periods'
        ? profitLossColumns.map((column, index) => ({
            id: `date_period_${index}`,
            Header: column,
            accessor: `total_periods[${index}].formatted_amount`,
            width: getColumnWidth(
              profitLossTableRows,
              `total_periods.${index}.formatted_amount`,
              { minWidth: 100 },
            ),
            className: 'total-period',
          }))
        : []),
    ],
    [
      profitLossQuery.display_columns_type,
      profitLossTableRows,
      profitLossColumns,
      formatMessage,
    ],
  );

  // Retrieve default expanded rows of balance sheet.
  const expandedRows = useMemo(
    () => defaultExpanderReducer(profitLossTableRows, 3),
    [profitLossTableRows],
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
      fromDate={profitLossQuery.from_date}
      toDate={profitLossQuery.to_date}
      name="profit-loss-sheet"
      loading={profitLossSheetLoading}
      basis={profitLossQuery.basis}
    >
      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={profitLossTableRows}
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

export default compose(
  withProfitLossDetail(
    ({
      profitLossQuery,
      profitLossColumns,
      profitLossTableRows,
      profitLossSheetLoading,
    }) => ({
      profitLossColumns,
      profitLossQuery,
      profitLossTableRows,
      profitLossSheetLoading,
    }),
  ),
)(ProfitLossSheetTable);
