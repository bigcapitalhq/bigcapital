import React, { useMemo, useCallback } from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { DataTable } from 'components';
import FinancialSheet from 'components/FinancialSheet';

import withAPAgingSummary from './withAPAgingSummary';

import { compose, getColumnWidth } from 'utils';

/**
 * AP aging summary table sheet.
 */
function APAgingSummaryTable({
  //#withPayableAgingSummary
  payableAgingColumns,
  payableAgingRows,
  payableAgingLoading,

  //#ownProps
  organizationName,
}) {
  const { formatMessage } = useIntl();
  const agingColumns = useMemo(
    () =>
      payableAgingColumns.map((agingColumn) => {
        return `${agingColumn.before_days} - ${
          agingColumn.to_days || 'And Over'
        }`;
      }),
    [payableAgingColumns],
  );

  const columns = useMemo(
    () => [
      {
        Header: <T id={'vendor_name'} />,
        accessor: 'name',
        className: 'name',
        width: 240,
        sticky: 'left',
        textOverview: true,
      },
      {
        Header: <T id={'current'} />,
        accessor: 'current',
        className: 'current',
        width: getColumnWidth(payableAgingRows, `current`, {
          minWidth: 120,
        }),
      },

      ...agingColumns.map((agingColumn, index) => ({
        Header: agingColumn,
        accessor: `aging-${index}`,
        width: getColumnWidth(payableAgingRows, `aging-${index}`, {
          minWidth: 120,
        }),
      })),
      {
        Header: <T id={'total'} />,
        accessor: 'total',
        width: getColumnWidth(payableAgingRows, 'total', {
          minWidth: 120,
        }),
      },
    ],
    [payableAgingRows],
  );
  const rowClassNames = (row) => [`row-type--${row.original.rowType}`];

  return (
    <FinancialSheet
      companyName={organizationName}
      name={'payable-aging-summary'}
      sheetType={formatMessage({ id: 'payable_aging_summary' })}
      asDate={new Date()}
      loading={payableAgingLoading}
    >
      <DataTable
        className={'bigcapital-datatable--financial-report'}
        columns={columns}
        data={payableAgingRows}
        rowClassNames={rowClassNames}
        noInitialFetch={true}
        sticky={true}
      />
    </FinancialSheet>
  );
}

export default compose(
  withAPAgingSummary(
    ({
      payableAgingSummaryLoading,
      payableAgingSummaryColumns,
      payableAgingSummaryRows,
    }) => ({
      payableAgingLoading: payableAgingSummaryLoading,
      payableAgingColumns: payableAgingSummaryColumns,
      payableAgingRows: payableAgingSummaryRows,
    }),
  ),
)(APAgingSummaryTable);
