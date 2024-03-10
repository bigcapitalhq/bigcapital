// @ts-nocheck
import React from 'react';

const UncategorizeTransactionAlert = React.lazy(
  () => import('./UncategorizeTransactionAlert/UncategorizeTransactionAlert'),
);

/**
 * Cashflow alerts.
 */
export const CashflowAlerts = [
  {
    name: 'cashflow-tranaction-uncategorize',
    component: UncategorizeTransactionAlert,
  },
];
