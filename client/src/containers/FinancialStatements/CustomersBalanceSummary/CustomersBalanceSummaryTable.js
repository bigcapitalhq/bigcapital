import React, { useMemo, useCallback } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';

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
  const { formatMessage } = useIntl();

  const {
    isCustomersBalanceLoading,
    CustomerBalanceSummary: { tableRows },
  } = useCustomersBalanceSummaryContext();

  const columns = useCustomersSummaryColumns();

  const rowClassNames = (row) => {
    return [`row-type--${row.original.rowTypes}`];
  };

  return (
    <FinancialSheet
      name={'customers-balance-summary'}
      companyName={companyName}
      sheetType={formatMessage({ id: 'customers_balance_summary' })}
      asDate={new Date()}
      loading={isCustomersBalanceLoading}
    >
      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={tableRows}
        rowClassNames={rowClassNames}
        noInitialFetch={true}
      />
    </FinancialSheet>
  );
}
