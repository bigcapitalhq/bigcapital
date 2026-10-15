import { BudgetVsActualTableQuery } from '@bigcapital/sdk-ts';
import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { transformDisplayColumnsType } from '../common';
import { FinancialReportPage } from '../FinancialReportPage';
import { useBudgetVsActualSummary } from '@/hooks/query';

type UseBudgetVsActualSummaryResult = ReturnType<
  typeof useBudgetVsActualSummary
>;

interface BudgetVsActualContextValue {
  budgetVsActual: UseBudgetVsActualSummaryResult['data'];
  refetchBudgetVsActual: UseBudgetVsActualSummaryResult['refetch'];
  isFetching: boolean;
  isLoading: boolean;
  query: BudgetVsActualTableQuery;
  filter: Record<string, unknown>;
  hasSelectedBudget: boolean;
}

interface BudgetVsActualBootProps {
  filter: Record<string, unknown>;
  children?: ReactNode;
}

const BudgetVsActualContext = createContext<
  BudgetVsActualContextValue | undefined
>(undefined);

/**
 * Budget vs actual boot.
 */
function BudgetVsActualBoot({ filter, ...props }: BudgetVsActualBootProps) {
  // Transforms the given filter to query.
  const query = useMemo(() => {
    // Resolves the display columns type (month/quarter/year).
    const parsed = transformDisplayColumnsType(filter) as Record<string, any>;
    const accountsIds = Array.isArray(parsed.accountsIds)
      ? parsed.accountsIds.map(Number)
      : undefined;

    // Avoids sending blank date filters; the API defaults them to the budget
    // date range when omitted.
    return {
      budgetId: parsed.budgetId ? Number(parsed.budgetId) : undefined,
      fromDate: parsed.fromDate || undefined,
      toDate: parsed.toDate || undefined,
      displayColumnsBy: parsed.displayColumnsBy || 'month',
      accountsIds: accountsIds?.length ? accountsIds : undefined,
      numberFormat: parsed.numberFormat,
    } as BudgetVsActualTableQuery;
  }, [filter]);

  // Detarmines whether the budget is selected.
  const hasSelectedBudget = Boolean(query.budgetId);

  // Fetches the budget vs actual report.
  const {
    data: budgetVsActual,
    isFetching,
    isLoading,
    refetch,
  } = useBudgetVsActualSummary(query, {
    placeholderData: (prev) => prev,
    enabled: hasSelectedBudget,
  });

  const provider: BudgetVsActualContextValue = {
    budgetVsActual,
    refetchBudgetVsActual: refetch,
    isFetching,
    isLoading: hasSelectedBudget && isLoading,
    query,
    filter,
    hasSelectedBudget,
  };

  return (
    <FinancialReportPage name={'budget-vs-actual'}>
      <BudgetVsActualContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useBudgetVsActualContext = (): BudgetVsActualContextValue => {
  const ctx = useContext(BudgetVsActualContext);
  if (!ctx)
    throw new Error(
      'useBudgetVsActualContext must be used within a BudgetVsActualBoot',
    );
  return ctx;
};

export { BudgetVsActualBoot, useBudgetVsActualContext };
