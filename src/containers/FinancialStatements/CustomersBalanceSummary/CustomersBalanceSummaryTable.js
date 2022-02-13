import React from 'react';
import intl from 'react-intl-universal';

import { DataTable, FinancialSheet } from 'components';

import { useCustomersBalanceSummaryContext } from './CustomersBalanceSummaryProvider';
import { useCustomersSummaryColumns } from './components';

import { tableRowTypesToClassnames } from 'utils';

/**
 * customers balance summary table.
 */
export default function CustomersBalanceSummaryTable({
  // #ownProps
  companyName,
}) {
  const {
    CustomerBalanceSummary: { table },
  } = useCustomersBalanceSummaryContext();

  const columns = useCustomersSummaryColumns();

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={intl.get('customers_balance_summary')}
      asDate={new Date()}
    >
      <DataTable
        columns={columns}
        data={table.data}
        rowClassNames={tableRowTypesToClassnames}
        noInitialFetch={true}
      />
    </FinancialSheet>
  );
}
