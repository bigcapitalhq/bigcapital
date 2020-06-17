import React, { useMemo, useCallback } from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import DataTable from "components/DataTable";
import FinancialSheet from 'components/FinancialSheet';
import Money from 'components/Money';

import withSettings from 'containers/Settings/withSettings';

import { compose } from 'utils';
import withReceivableAgingSummary from './withReceivableAgingSummary';
import withReceivableAgingSummaryTable from './withReceivableAgingSummaryTable';

function ReceivableAgingSummaryTable({
  // #withPreferences
  organizationSettings,

  // #withReceivableAgingSummary
  receivableAgingRows,
  receivableAgingLoading,
  receivableAgingColumns,
  
  // #ownProps
  onFetchData,
}) {
  const { formatMessage } = useIntl();

  const agingColumns = useMemo(() => {
    return receivableAgingColumns.map((agingColumn) => {
      return `${agingColumn.before_days} - ${agingColumn.to_days || 'And Over'}`;
    });
  }, [receivableAgingColumns]);
  
  const columns = useMemo(() => ([
    {
      Header: (<T id={'customer_name'} />),
      accessor: 'customer_name',
      className: 'customer_name',
      sticky: 'left',
    },
    ...agingColumns.map((agingColumn, index) => ({
      Header: agingColumn,
      accessor: (row) => {
        const amount = row[`aging-${index}`];
        if (row.rowType === 'total') {
          return <Money amount={amount} currency={'USD'} />
        }
        return amount > 0 ? amount : '';
      },
    })),
    {
      Header: (<T id={'total'} />),
      id: 'total',
      accessor: (row) => {
        return <Money amount={row.total} currency={'USD'} />;
      },
      className: 'total',
    },
  ]), [agingColumns]);

  const rowClassNames = (row) => [`row-type--${row.original.rowType}`];

  const handleFetchData = useCallback((...args) => {
    onFetchData && onFetchData(...args);
  }, []);

  return (
    <FinancialSheet
      companyName={organizationSettings.name}
      name={'receivable-aging-summary'}
      sheetType={formatMessage({ id: 'receivable_aging_summary' })}
      asDate={new Date()}
      loading={receivableAgingLoading}>

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
  withSettings,
  withReceivableAgingSummaryTable,
  withReceivableAgingSummary(({
    receivableAgingSummaryLoading,
    receivableAgingSummaryColumns,
    receivableAgingSummaryRows,
  }) => ({
    receivableAgingLoading: receivableAgingSummaryLoading,
    receivableAgingColumns: receivableAgingSummaryColumns,
    receivableAgingRows: receivableAgingSummaryRows, 
  })),
)(ReceivableAgingSummaryTable);