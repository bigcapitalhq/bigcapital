import React from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';

import { Button } from '@blueprintjs/core';
import { getColumnWidth } from 'utils';
import { If, Icon } from 'components';
import { CellTextSpan } from 'components/Datatable/Cells';
import { useTrialBalanceSheetContext } from './TrialBalanceProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';

/**
 * Retrieve trial balance sheet table columns.
 */
export const useTrialBalanceTableColumns = () => {
  const { formatMessage } = useIntl();

  // Trial balance sheet context.
  const {
    trialBalanceSheet: { tableRows },
  } = useTrialBalanceSheetContext();

  return React.useMemo(
    () => [
      {
        Header: formatMessage({ id: 'account_name' }),
        accessor: (row) => (row.code ? `${row.name} - ${row.code}` : row.name),
        className: 'name',
        width: 180,
        textOverview: true,
      },
      {
        Header: formatMessage({ id: 'credit' }),
        Cell: CellTextSpan,
        accessor: 'formatted_credit',
        className: 'credit',
        width: getColumnWidth(tableRows, `credit`, {
          minWidth: 80,
        }),
      },
      {
        Header: formatMessage({ id: 'debit' }),
        Cell: CellTextSpan,
        accessor: 'formatted_debit',
        width: getColumnWidth(tableRows, `debit`, { minWidth: 80 }),
      },
      {
        Header: formatMessage({ id: 'balance' }),
        Cell: CellTextSpan,
        accessor: 'formatted_balance',
        className: 'balance',
        width: getColumnWidth(tableRows, `balance`, {
          minWidth: 80,
        }),
      },
    ],
    [tableRows, formatMessage],
  );
};

/**
 * Trial balance sheet progress loading bar.
 */
export function TrialBalanceSheetLoadingBar() {
  const { isFetching } = useTrialBalanceSheetContext();

  return (
    <If condition={isFetching}>
      <FinancialLoadingBar />
    </If>
  );
}

/**
 * Trial balance sheet alerts.
 */
export function TrialBalanceSheetAlerts() {
  const {
    trialBalanceSheet: { meta },
    isLoading,
    refetchSheet,
  } = useTrialBalanceSheetContext();

  // Handle refetch the sheet.
  const handleRecalcReport = () => {
    refetchSheet();
  };
  // Can't display any error if the report is loading.
  if (isLoading) {
    return null;
  }

  return (
    <If condition={meta.is_cost_compute_running}>
      <div class="alert-compute-running">
        <Icon icon="info-block" iconSize={12} />
        <T id={'just_a_moment_we_re_calculating_your_cost_transactions'} />

        <Button onClick={handleRecalcReport} minimal={true} small={true}>
          <T id={'refresh'} />
        </Button>
      </div>
    </If>
  );
}
