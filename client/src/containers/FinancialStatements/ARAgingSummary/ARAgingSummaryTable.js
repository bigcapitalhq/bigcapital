import React, { useMemo, useCallback } from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import DataTable from 'components/DataTable';
import FinancialSheet from 'components/FinancialSheet';

import withARAgingSummary from './withARAgingSummary';

import { compose } from 'utils';

/**
 * AR aging summary table sheet.
 */
function ReceivableAgingSummaryTable({
  // #withReceivableAgingSummary
  receivableAgingRows,
  receivableAgingLoading,
  receivableAgingColumns,

  // #ownProps
  onFetchData,
  organizationName,
}) {
  const { formatMessage } = useIntl();

  const agingColumns = useMemo(() => {
    return receivableAgingColumns.map((agingColumn) => {
      return `${agingColumn.before_days} - ${
        agingColumn.to_days || 'And Over'
      }`;
    });
  }, [receivableAgingColumns]);

  const columns = useMemo(
    () => [
      {
        Header: <T id={'customer_name'} />,
        accessor: 'name',
        className: 'customer_name',
        sticky: 'left',
        width: 200,
      },
      {
        Header: <T id={'current'} />,
        accessor: 'current',
        className: 'current',
        width: 120,
      },
      ...agingColumns.map((agingColumn, index) => ({
        Header: agingColumn,
        accessor: `aging-${index }`,
        width: 120,
      })),
      {
        Header: (<T id={'total'} />),
        id: 'total',
        accessor: 'total',
        className: 'total',
        width: 140,
      },
    ],
    [agingColumns],
  );

  const rowClassNames = (row) => [`row-type--${row.original.rowType}`];

  const handleFetchData = useCallback((...args) => {
    // onFetchData && onFetchData(...args);
  }, []);

  return (
    <FinancialSheet
      companyName={organizationName}
      name={'receivable-aging-summary'}
      sheetType={formatMessage({ id: 'receivable_aging_summary' })}
      asDate={new Date()}
      loading={receivableAgingLoading}
    >
      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={receivableAgingRows}
        rowClassNames={rowClassNames}
        onFetchData={handleFetchData}
        noInitialFetch={true}
        sticky={true}
      />
    </FinancialSheet>
  );
}

export default compose(
  withARAgingSummary(
    ({
      receivableAgingSummaryLoading,
      receivableAgingSummaryColumns,
      receivableAgingSummaryRows,
    }) => ({
      receivableAgingLoading: receivableAgingSummaryLoading,
      receivableAgingColumns: receivableAgingSummaryColumns,
      receivableAgingRows: receivableAgingSummaryRows,
    }),
  ),
)(ReceivableAgingSummaryTable);
