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
  // Transforms the given state query to http query.
  const httpQuery = React.useMemo(
    () => transformFilterFormToQuery(filter),
    [filter],
  );
  // Fetching the cash flow statement report.
  const {
    data: cashFlowStatement,
    isFetching: isCashFlowFetching,
    isLoading: isCashFlowLoading,
    refetch: refetchCashFlow,
  } = useCashFlowStatementReport(httpQuery, { keepPreviousData: true });

  const provider = {
    cashFlowStatement,
    isCashFlowFetching,
    isCashFlowLoading,
    refetchCashFlow,
    query: httpQuery,
    filter,
    httpQuery,
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
