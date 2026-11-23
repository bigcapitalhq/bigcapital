import { lazy } from 'react';

const BudgetDeleteAlert = lazy(() =>
  import('./BudgetDeleteAlert').then((m) => ({
    default: m.BudgetDeleteAlert,
  })),
);

/**
 * Budgets alerts.
 */
export const BudgetsAlerts = [
  { name: 'budget-delete', component: BudgetDeleteAlert },
];
