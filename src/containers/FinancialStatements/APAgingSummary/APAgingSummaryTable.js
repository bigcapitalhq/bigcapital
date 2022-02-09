import React from 'react';
import intl from 'react-intl-universal';

import { DataTable, FinancialSheet } from 'components';

import { useAPAgingSummaryContext } from './APAgingSummaryProvider';
import { useAPAgingSummaryColumns } from './components';

/**
 * AP aging summary table sheet.
 */
export default function APAgingSummaryTable({
  //#ownProps
  organizationName,
}) {
  // AP aging summary report content.
  const {
    APAgingSummary: { tableRows },
    isAPAgingLoading,
  } = useAPAgingSummaryContext();

  // AP aging summary columns.
  const columns = useAPAgingSummaryColumns();

  const rowClassNames = (row) => [`row-type--${row.original.rowType}`];

  return (
    <FinancialSheet
      companyName={organizationName}
      name={'payable-aging-summary'}
      sheetType={intl.get('payable_aging_summary')}
      asDate={new Date()}
      loading={isAPAgingLoading}
    >
      <DataTable
        className={'bigcapital-datatable--financial-report'}
        columns={columns}
        data={tableRows}
        rowClassNames={rowClassNames}
        noInitialFetch={true}
        sticky={true}
      />
    </FinancialSheet>
  );
}
