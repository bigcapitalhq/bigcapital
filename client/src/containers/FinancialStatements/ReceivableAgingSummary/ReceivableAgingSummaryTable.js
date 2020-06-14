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
  receviableAgingRows = [],
  receivableAgingLoading,
  receivableAgingColumns,
  
  // #ownProps
  receivableAgingSummaryQuery,
  onFetchData,
}) {
  const { formatMessage } = useIntl();

  const agingColumns = useMemo(() => {
    return receivableAgingColumns.map((agingColumn) => {
      return `${agingColumn.before_days} - ${agingColumn.to_days || '<'}`;
    });
  }, [receivableAgingColumns]);
  
  const columns = useMemo(() => ([
    {
      Header: (<T id={'customer_name'} />),
      accessor: 'customer_name',
      className: 'customer_name',
    },
    ...agingColumns.map((agingColumn, index) => ({
      Header: agingColumn,
      id: `asd-${index}`,
    })),
    {
      Header: (<T id={'total'} />),
      accessor: 'total',
      className: 'total',
    },
  ]), [agingColumns]);

  const handleFetchData = useCallback((...args) => {
    onFetchData && onFetchData(...args);
  }, [onFetchData]);

  return (
    <FinancialSheet
      companyName={organizationSettings.name}
      sheetType={formatMessage({ id: 'receivable_aging_summary' })}
      asDate={new Date()}
      loading={receivableAgingLoading}>

      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={receviableAgingRows}
        onFetchData={handleFetchData}
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
    receivableAgingSummaryColumns }) => ({
    receivableAgingLoading: receivableAgingSummaryLoading,
    receivableAgingColumns: receivableAgingSummaryColumns 
  })),
)(ReceivableAgingSummaryTable);