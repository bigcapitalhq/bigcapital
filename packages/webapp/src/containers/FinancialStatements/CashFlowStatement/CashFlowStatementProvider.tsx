import React from 'react';
import { transformFilterFormToQuery } from '../common';
import { FinancialReportPage } from '../FinancialReportPage';
import { useCashFlowStatementReport } from '@/hooks/query';

type UseCashFlowResult = ReturnType<typeof useCashFlowStatementReport>;

type CashFlowStatementContextValue = {
  cashFlowStatement: UseCashFlowResult['data'];
  isCashFlowFetching: boolean;
  isCashFlowLoading: boolean;
  refetchCashFlow: UseCashFlowResult['refetch'];
  query: Record<string, unknown>;
  filter: Record<string, unknown>;
  httpQuery: Record<string, unknown>;
};

type CashFlowStatementProviderProps = {
  filter: Record<string, unknown>;
  children?: React.ReactNode;
};

const CashFLowStatementContext = React.createContext<
  CashFlowStatementContextValue | undefined
>(undefined);

/**
 * Cash flow statement provider.
 */
function CashFlowStatementProvider({
  filter,
  ...props
}: CashFlowStatementProviderProps) {
  const httpQuery = React.useMemo(
    () => transformFilterFormToQuery(filter) as Record<string, unknown>,
    [filter],
  );
  const {
    data: cashFlowStatement,
    isFetching: isCashFlowFetching,
    isLoading: isCashFlowLoading,
    refetch: refetchCashFlow,
  } = useCashFlowStatementReport(httpQuery, {
    placeholderData: (prev) => prev,
  });

  const provider: CashFlowStatementContextValue = {
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

const useCashFlowStatementContext = (): CashFlowStatementContextValue => {
  const ctx = React.useContext(CashFLowStatementContext);
  if (!ctx) {
    throw new Error(
      'useCashFlowStatementContext must be used within a CashFlowStatementProvider',
    );
  }
  return ctx;
};

export { CashFlowStatementProvider, useCashFlowStatementContext };
