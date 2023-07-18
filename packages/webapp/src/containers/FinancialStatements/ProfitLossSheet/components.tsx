// @ts-nocheck
import React from 'react';
import { Button } from '@blueprintjs/core';
import { Icon, If, FormattedMessage as T } from '@/components';

import { useProfitLossSheetContext } from './ProfitLossProvider';
import { FinancialComputeAlert } from '../FinancialReportPage';
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
  // Can't continue if the cost compute job is not running.
  if (!profitLossSheet.meta.is_cost_compute_running) {
    return null;
  }
  return (
    <FinancialComputeAlert>
      <Icon icon="info-block" iconSize={12} />
      <T id={'just_a_moment_we_re_calculating_your_cost_transactions'} />

      <Button onClick={handleRecalcReport} minimal={true} small={true}>
        <T id={'refresh'} />
      </Button>
    </FinancialComputeAlert>
  );
}
