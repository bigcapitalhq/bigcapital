import React, { useMemo } from 'react';
import intl from 'react-intl-universal';

import { DataTable, FinancialSheet } from 'components';

import { useVendorsTransactionsColumns } from './components';
import { useVendorsTransactionsContext } from './VendorsTransactionsProvider';

import { defaultExpanderReducer, tableRowTypesToClassnames } from 'utils';
import { TableStyle } from 'common';

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
        columns={columns}
        data={tableRows}
        rowClassNames={tableRowTypesToClassnames}
        noInitialFetch={true}
        expandable={true}
        expanded={expandedRows}
        expandToggleColumn={1}
        expandColumnSpace={0.8}
        styleName={TableStyle.Constrant}
      />
    </FinancialSheet>
  );
}
