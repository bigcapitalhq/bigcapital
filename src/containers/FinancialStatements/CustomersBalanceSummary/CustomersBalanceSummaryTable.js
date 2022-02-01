import React from 'react';
import intl from 'react-intl-universal';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';

import { useCustomersBalanceSummaryContext } from './CustomersBalanceSummaryProvider';
import { useCustomersSummaryColumns } from './components';

/**
 * customers balance summary table.
 */
export default function CustomersBalanceSummaryTable({
  // #ownProps
  companyName,
}) {
  const {
    isCustomersBalanceLoading,
    CustomerBalanceSummary: { table },
  } = useCustomersBalanceSummaryContext();

  const columns = useCustomersSummaryColumns();

  const rowClassNames = (row) => {
    return [`row-type--${row.original.row_types}`];
  };

  return (
    <FinancialSheet
      name={'customers-balance-summary'}
      companyName={companyName}
      sheetType={intl.get('customers_balance_summary')}
      asDate={new Date()}
      loading={isCustomersBalanceLoading}
    >
      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={table.data}
        rowClassNames={rowClassNames}
        noInitialFetch={true}
      />
    </FinancialSheet>
  );
}
