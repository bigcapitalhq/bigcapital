import React, { useMemo, useCallback } from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import { useCustomersTransactionsColumns } from './components';
import { useCustomersTransactionsContext } from './CustomersTransactionsProvider';

import { defaultExpanderReducer, getColumnWidth } from 'utils';

/**
 * Customers transactions table.
 */
export default function CustomersTransactionsTable({
  // #ownProps
  companyName,
}) {
  

  const {
    customersTransactions: { tableRows },
    isCustomersTransactionsLoading,
    query,
  } = useCustomersTransactionsContext();

  const columns = useCustomersTransactionsColumns();

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
      sheetType={intl.get('customers_transactions')}
      loading={isCustomersTransactionsLoading}
      fromDate={query.from_date}
      toDate={query.to_date}
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
