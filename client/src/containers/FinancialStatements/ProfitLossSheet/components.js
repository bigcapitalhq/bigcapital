import React from 'react';
import { Button } from '@blueprintjs/core';
import { Icon, If } from 'components';
import { useProfitLossSheetContext } from './ProfitLossProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';

/**
 * Profit/loss sheet loading bar.
 */
export function ProfitLossSheetLoadingBar() {
  const { isFetching } = useProfitLossSheetContext();

  return (
    <If condition={isFetching}>
      <FinancialLoadingBar />
    </If>
  );
}

/**
 * Balance sheet alerts.
 */
export function ProfitLossSheetAlerts() {
  const {
    isLoading,
    sheetRefetch,
    profitLossSheet,
  } = useProfitLossSheetContext();

  // Handle refetch the report sheet.
  const handleRecalcReport = () => {
    sheetRefetch();
  };
  // Can't display any error if the report is loading.
  if (isLoading) {
    return null;
  }

  return (
    <If condition={profitLossSheet.meta.is_cost_compute_running}>
      <div class="alert-compute-running">
        <Icon icon="info-block" iconSize={12} /> Just a moment! We're
        calculating your cost transactions and this doesn't take much time.
        Please check after sometime.{' '}
        <Button onClick={handleRecalcReport} minimal={true} small={true}>
          Refresh
        </Button>
      </div>
    </If>
  );
}
