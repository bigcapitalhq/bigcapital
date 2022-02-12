import React from 'react';
import intl from 'react-intl-universal';

import { DataTable, FinancialSheet } from 'components';

import { useVendorsBalanceColumns } from './components';
import { useVendorsBalanceSummaryContext } from './VendorsBalanceSummaryProvider';

import { tableRowTypesToClassnames } from 'utils';

/**
 * Vendors balance summary table.
 */
export default function VendorsBalanceSummaryTable({
  //#ownProps
  organizationName,
}) {
  const {
    VendorBalanceSummary: { table },
  } = useVendorsBalanceSummaryContext();

  // vendors balance summary columns.
  const columns = useVendorsBalanceColumns();

  return (
    <FinancialSheet
      companyName={organizationName}
      name={'vendors-balance-summary'}
      sheetType={intl.get('vendors_balance_summary')}
      asDate={new Date()}
    >
      <DataTable
        className={'bigcapital-datatable--financial-report'}
        columns={columns}
        data={table?.data}
        rowClassNames={tableRowTypesToClassnames}
        noInitialFetch={true}
      />
    </FinancialSheet>
  );
}
