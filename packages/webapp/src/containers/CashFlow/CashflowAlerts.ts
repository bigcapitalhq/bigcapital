import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';

const UncategorizeTransactionAlert: LazyExoticComponent<ComponentType> = lazy(
  () =>
    import('./UncategorizeTransactionAlert/UncategorizeTransactionAlert').then(
      (m) => ({ default: m.UncategorizeTransactionAlert }),
    ),
);

interface CashflowAlertEntry {
  name: string;
  component: LazyExoticComponent<ComponentType>;
}

/**
 * Cashflow alerts.
 */
export const CashflowAlerts: CashflowAlertEntry[] = [
  {
    name: 'cashflow-tranaction-uncategorize',
    component: UncategorizeTransactionAlert,
  },
];
