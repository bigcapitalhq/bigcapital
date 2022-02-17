import React from 'react';
import { Button } from '@blueprintjs/core';

import { Icon, If } from 'components';
import { FormattedMessage as T } from 'components';
import FinancialLoadingBar from '../FinancialLoadingBar';

import { dynamicColumns } from './dynamicColumns';
import { useCashFlowStatementContext } from './CashFlowStatementProvider';

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
        <Icon icon="info-block" iconSize={12} />
        <T id={'just_a_moment_we_re_calculating_your_cost_transactions'} />
        <Button onClick={handleRecalcReport} minimal={true} small={true}>
          <T id={'refresh'} />
        </Button>
      </div>
    </If>
  );
}
