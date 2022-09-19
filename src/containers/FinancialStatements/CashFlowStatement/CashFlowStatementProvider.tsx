// @ts-nocheck
import React from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useCashFlowStatementReport } from '@/hooks/query';
import { transformFilterFormToQuery } from '../common';

const CashFLowStatementContext = React.createContext();

/**
 * Cash flow statement provider.
 */
function CashFlowStatementProvider({ filter, ...props }) {
  // transforms the given filter to query.
  const query = React.useMemo(
    () => transformFilterFormToQuery(filter),
    [filter],
  );

  // fetch the cash flow statement report.
  const {
    data: cashFlowStatement,
    isFetching: isCashFlowFetching,
    isLoading: isCashFlowLoading,
    refetch: refetchCashFlow,
  } = useCashFlowStatementReport(query, { keepPreviousData: true });

  const provider = {
    cashFlowStatement,
    isCashFlowFetching,
    isCashFlowLoading,
    refetchCashFlow,
    query,
    filter,
  };

  return (
    <FinancialReportPage name="cash-flow-statement">
      <CashFLowStatementContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useCashFlowStatementContext = () =>
  React.useContext(CashFLowStatementContext);

export { CashFlowStatementProvider, useCashFlowStatementContext };
