import React, { useMemo, useCallback } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import { useVendorsTransactionsColumns } from './components';
import { useVendorsTranscationsContext } from './VendorsTransactionsProvider';

import { defaultExpanderReducer, getColumnWidth } from 'utils';

/**
 * Vendors transcations table.
 */

export default function VendorsTransactionsTable({
  // #ownProps
  companyName,
}) {
  const { formatMessage } = useIntl();

  const {
    vendorsTransactions: { tableRows },
    isVendorsTransactionsLoading,
    filter,
  } = useVendorsTranscationsContext();

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
      sheetType={formatMessage({ id: 'vendors_transactions' })}
      loading={isVendorsTransactionsLoading}
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
