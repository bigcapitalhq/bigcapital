import React, { useCallback } from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { DataTable } from 'components';
import FinancialSheet from 'components/FinancialSheet';

import { useAPAgingSummaryContext } from './APAgingSummaryProvider';
import { useAPAgingSummaryColumns } from './components';

/**
 * AP aging summary table sheet.
 */
export default function APAgingSummaryTable({
  //#ownProps
  organizationName,
}) {
  const { formatMessage } = useIntl();

  // AP aging summary report content.
  const {
    APAgingSummary: { tableRows },
    isAPAgingFetching,
  } = useAPAgingSummaryContext();

  // AP aging summary columns.
  const columns = useAPAgingSummaryColumns();

  const rowClassNames = (row) => [`row-type--${row.original.rowType}`];

  return (
    <FinancialSheet
      companyName={organizationName}
      name={'payable-aging-summary'}
      sheetType={formatMessage({ id: 'payable_aging_summary' })}
      asDate={new Date()}
      loading={isAPAgingFetching}
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
