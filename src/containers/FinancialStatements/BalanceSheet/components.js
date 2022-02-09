import React from 'react';
import { Button } from '@blueprintjs/core';

import { useAppIntlContext } from 'components/AppIntlProvider';
import { FormattedMessage as T, Icon, If } from 'components';

import { useBalanceSheetContext } from './BalanceSheetProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';
import { FinancialComputeAlert } from '../FinancialReportPage';
import { dynamicColumns } from './dynamicColumns';

/**
 * Balance sheet alerts.
 */
export function BalanceSheetAlerts() {
  const { isLoading, refetchBalanceSheet, balanceSheet } =
    useBalanceSheetContext();

  // Handle refetch the report sheet.
  const handleRecalcReport = () => {
    refetchBalanceSheet();
  };
  // Can't display any error if the report is loading.
  if (isLoading) return null;

  return (
    <If condition={balanceSheet.meta.is_cost_compute_running}>
      <FinancialComputeAlert>
        <Icon icon="info-block" iconSize={12} />{' '}
        <T id={'just_a_moment_we_re_calculating_your_cost_transactions'} />

        <Button onClick={handleRecalcReport} minimal={true} small={true}>
          <T id={'report.compute_running.refresh'} />
        </Button>
      </FinancialComputeAlert>
    </If>
  );
}

/**
 * Balance sheet loading bar.
 */
export function BalanceSheetLoadingBar() {
  const { isFetching } = useBalanceSheetContext();

  return (
    <If condition={isFetching}>
      <FinancialLoadingBar />
    </If>
  );
}

/**
 * Retrieve balance sheet columns.
 */
export const useBalanceSheetColumns = () => {
  // Balance sheet context.
  const {
    balanceSheet: { table },
  } = useBalanceSheetContext();

  const { direction } = useAppIntlContext()

  return React.useMemo(
    () => dynamicColumns(direction, table.columns, table.rows),
    [direction, table],
  );
};
