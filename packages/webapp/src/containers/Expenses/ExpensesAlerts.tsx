import React from 'react';

const ExpenseDeleteAlert = React.lazy(() =>
  import('@/containers/Alerts/Expenses/ExpenseDeleteAlert').then((m) => ({
    default: m.ExpenseDeleteAlert,
  })),
);
const ExpensePublishAlert = React.lazy(() =>
  import('@/containers/Alerts/Expenses/ExpensePublishAlert').then((m) => ({
    default: m.ExpensePublishAlert,
  })),
);

/**
 * Accounts alert.
 */
export const ExpensesAlerts = [
  { name: 'expense-delete', component: ExpenseDeleteAlert },
  { name: 'expense-publish', component: ExpensePublishAlert },
];
