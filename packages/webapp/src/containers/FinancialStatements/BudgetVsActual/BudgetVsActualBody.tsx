import React from 'react';
import { FinancialReportBody } from '../FinancialReportPage';
import { useBudgetVsActualContext } from './BudgetVsActualBoot';
import { BudgetVsActualTable } from './BudgetVsActualTable';
import {
  BudgetVsActualNoBudgetsState,
  BudgetVsActualSelectBudgetState,
} from './components';
import { FinancialSheetSkeleton } from '@/components';
import { useBudgets } from '@/hooks/query';

/**
 * Budget vs actual body.
 */
export function BudgetVsActualBody() {
  const { isLoading, hasSelectedBudget } = useBudgetVsActualContext();

  // Fetches the budgets list (shared cache with the filter panel).
  const { data: budgetsData, isLoading: isBudgetsLoading } = useBudgets({
    pageSize: 100,
  });

  const hasBudgets = (budgetsData?.data ?? []).length > 0;

  if (!isBudgetsLoading && !hasBudgets) {
    return (
      <FinancialReportBody>
        <BudgetVsActualNoBudgetsState />
      </FinancialReportBody>
    );
  }
  if (!hasSelectedBudget) {
    return (
      <FinancialReportBody>
        <BudgetVsActualSelectBudgetState />
      </FinancialReportBody>
    );
  }
  return (
    <FinancialReportBody>
      {isLoading ? <FinancialSheetSkeleton /> : <BudgetVsActualTable />}
    </FinancialReportBody>
  );
}
