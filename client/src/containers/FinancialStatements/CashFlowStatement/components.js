import React from 'react';
import { Button } from '@blueprintjs/core';
import { Icon, If } from 'components';

import { dynamicColumns } from './utils';
import { useCashFlowStatementContext } from './CashFlowStatementProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';

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
  const { isCashFlowLoading } = useCashFlowStatementContext();
  return (
    <If condition={isCashFlowLoading}>
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

  return (
    <If condition={cashFlowStatement.meta.is_cost_compute_running}>
      <div className="alert-compute-running">
        <Icon icon="info-block" iconSize={12} /> Just a moment! We're
        calculating your cost transactions and this doesn't take much time.
        Please check after sometime.
        <Button onClick={handleRecalcReport} minimal={true} small={true}>
          Refresh
        </Button>
      </div>
    </If>
  );
}
