// @ts-nocheck
import React from 'react';
import { Button } from '@blueprintjs/core';
import { Icon, If, FormattedMessage as T } from '@/components';

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
  const { isLoading, sheetRefetch, profitLossSheet } =
    useProfitLossSheetContext();

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
        <Icon icon="info-block" iconSize={12} />
        <T id={'just_a_moment_we_re_calculating_your_cost_transactions'} />

        <Button onClick={handleRecalcReport} minimal={true} small={true}>
          <T id={'refresh'} />
        </Button>
      </div>
    </If>
  );
}
