import React from 'react';
import { Button } from '@blueprintjs/core';
import { Icon, If } from 'components';
import { useBalanceSheetContext } from './BalanceSheetProvider';

/**
 * Balance sheet alerts.
 */
export function BalanceSheetAlerts() {
  const {
    isLoading,
    refetchBalanceSheet,
    balanceSheet,
  } = useBalanceSheetContext();

  // Handle recalculate the report button.
  const handleRecalcReport = () => {
    refetchBalanceSheet();
  };
  // Can't display any error if the report is loading.
  if (isLoading) { return null; }

  return (
    <If condition={balanceSheet.meta.is_cost_compute_running}>
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
