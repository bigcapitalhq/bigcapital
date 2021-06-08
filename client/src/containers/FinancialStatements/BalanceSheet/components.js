import React from 'react';
import { Button } from '@blueprintjs/core';
import { Icon, If } from 'components';
import { useBalanceSheetContext } from './BalanceSheetProvider';
import { FormattedMessage as T } from 'react-intl';
import FinancialLoadingBar from '../FinancialLoadingBar';

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
  if (isLoading) {
    return null;
  }

  return (
    <If condition={balanceSheet.meta.is_cost_compute_running}>
      <div class="alert-compute-running">
        <Icon icon="info-block" iconSize={12} />{' '}
        <T id={'just_a_moment_we_re_calculating_your_cost_transactions'} />
        <Button onClick={handleRecalcReport} minimal={true} small={true}>
          <T id={'refresh'} />
        </Button>
      </div>
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
