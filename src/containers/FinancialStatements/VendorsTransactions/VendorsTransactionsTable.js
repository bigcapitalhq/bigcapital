import React, { useMemo } from 'react';
import intl from 'react-intl-universal';

import { DataTable, FinancialSheet } from 'components';

import { useVendorsTransactionsColumns } from './components';
import { useVendorsTransactionsContext } from './VendorsTransactionsProvider';

import { defaultExpanderReducer } from 'utils';

/**
 * Vendors transactions table.
 */

export default function VendorsTransactionsTable({
  // #ownProps
  companyName,
}) {
  // Vendor transactions context.
  const {
    vendorsTransactions: { tableRows },
    isVendorsTransactionsLoading,
    query,
  } = useVendorsTransactionsContext();

  // Retireve vendor transactions table columns.
  const columns = useVendorsTransactionsColumns();

  const expandedRows = useMemo(
    () => defaultExpanderReducer(tableRows, 5),
    [tableRows],
  );

  const rowClassNames = (row) => {
    return [`row-type--${row.original.row_types}`];
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
