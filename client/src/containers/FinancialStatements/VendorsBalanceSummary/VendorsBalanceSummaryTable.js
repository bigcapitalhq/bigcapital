import React from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { DataTable } from 'components';
import FinancialSheet from 'components/FinancialSheet';

import { useVendorsBalanceColumns } from './components';
import { useVendorsBalanceSummaryContext } from './VendorsBalanceSummaryProvider';

/**
 * Vendors balance summary table.
 */
export default function VendorsBalanceSummaryTable({
  //#ownProps
  organizationName,
}) {
  const { formatMessage } = useIntl();

  const {
    VendorBalanceSummary,
    isVendorsBalanceLoading,
  } = useVendorsBalanceSummaryContext();

  // vendors balance summary columns.
  const columns = useVendorsBalanceColumns();

  const rowClassNames = (row) => {
    return [`row-type--${row.original.rowTypes}`];
  };

  return (
    <FinancialSheet
      companyName={organizationName}
      name={'vendors-balance-summary'}
      sheetType={formatMessage({ id: 'vendors_balance_summary' })}
      asDate={new Date()}
      loading={isVendorsBalanceLoading}
    >
      <DataTable
        className={'bigcapital-datatable--financial-report'}
        columns={columns}
        data={VendorBalanceSummary?.tableRows}
        rowClassNames={rowClassNames}
        noInitialFetch={true}
      />
    </FinancialSheet>
  );
}
