import React from 'react';
import { If } from 'components';

import { dynamicColumns } from './utils';
import { useCashFlowStatementContext } from './CashFlowStatementProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';

/**
 * Retrieve cash flow statement columns.
 */
export const useCashFlowStatementColumns = () => {
  const {
    cashFlowStatement: { columns, data },
  } = useCashFlowStatementContext();

  return React.useMemo(() => dynamicColumns(columns, data), [columns, data]);
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
