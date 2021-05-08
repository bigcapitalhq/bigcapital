import React, { useMemo, useCallback } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import { useCustomersTranscationsColumns } from './components';
import { useCustomersTranscationsContext } from './CustomersTranscationsProvider';

import { defaultExpanderReducer, getColumnWidth } from 'utils';

/**
 * Customers transcations table.
 */
export default function CustomersTransactionsTable({
  // #ownProps
  companyName,
}) {
  const { formatMessage } = useIntl();

  const {
    customersTransactions: { tableRows },
    isCustomersTransactionsLoading,
    filter,
  } = useCustomersTranscationsContext();

  const columns = useCustomersTranscationsColumns();

  const expandedRows = useMemo(() => defaultExpanderReducer(tableRows, 4), [
    tableRows,
  ]);

  const rowClassNames = (row) => {
    return [`row-type--${row.original.rowTypes}`];
  };

  return (
    <FinancialSheet
      name="customer-transactions"
      companyName={companyName}
      sheetType={formatMessage({ id: 'customers_transactions' })}
      loading={isCustomersTransactionsLoading}
      fromDate={filter.fromDate}
      toDate={filter.toDate}
    >
      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={tableRows}
        rowClassNames={rowClassNames}
        noInitialFetch={true}
        expandable={true}
        expanded={expandedRows}
        expandToggleColumn={1}
        expandColumnSpace={0.8}
      />
    </FinancialSheet>
  );
}
