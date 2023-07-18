// @ts-nocheck
import React from 'react';
import { Button } from '@blueprintjs/core';

import { Icon, If, FormattedMessage as T } from '@/components';
import FinancialLoadingBar from '../FinancialLoadingBar';

import { dynamicColumns } from './dynamicColumns';
import { useCashFlowStatementContext } from './CashFlowStatementProvider';
import { FinancialComputeAlert } from '../FinancialReportPage';

/**
 * Retrieve cash flow statement columns.
 */
export const useCashFlowStatementColumns = () => {
  const {
    cashFlowStatement: { columns, tableRows },
  } = useCashFlowStatementContext();

  return React.useMemo(
    () => dynamicColumns(columns, tableRows),
    [columns, tableRows],
  );
};

/**
 * Cash flow statement loading bar.
 */
export function CashFlowStatementLoadingBar() {
  const { isCashFlowFetching } = useCashFlowStatementContext();

  return (
    <If condition={isCashFlowFetching}>
      <FinancialLoadingBar />
    </If>
  );
}

/**
 * Cash flow statement alter
 */
export function CashFlowStatementAlerts() {
  const { cashFlowStatement, isCashFlowLoading, refetchCashFlow } =
    useCashFlowStatementContext();

  // Handle refetch the report sheet.
  const handleRecalcReport = () => {
    refetchCashFlow();
  };
  // Can't display any error if the report is loading
  if (isCashFlowLoading) {
    return null;
  }
  // Can't continue if the cost compute is not running.
  if (!cashFlowStatement.meta.is_cost_compute_running) {
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
