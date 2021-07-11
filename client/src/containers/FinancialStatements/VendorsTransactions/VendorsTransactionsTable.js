import React, { useMemo, useCallback } from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import { useVendorsTransactionsColumns } from './components';
import { useVendorsTransactionsContext } from './VendorsTransactionsProvider';

import { defaultExpanderReducer, getColumnWidth } from 'utils';

/**
 * Vendors transactions table.
 */

export default function VendorsTransactionsTable({
  // #ownProps
  companyName,
}) {
  

  const {
    vendorsTransactions: { tableRows },
    isVendorsTransactionsLoading,
    query,
  } = useVendorsTransactionsContext();

  const columns = useVendorsTransactionsColumns();

  const expandedRows = useMemo(() => defaultExpanderReducer(tableRows, 5), [
    tableRows,
  ]);

  const rowClassNames = (row) => {
    return [`row-type--${row.original.rowTypes}`];
  };

  return (
    <FinancialSheet
      name="vendor-transactions"
      companyName={companyName}
      sheetType={intl.get('vendors_transactions')}
      loading={isVendorsTransactionsLoading}
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
