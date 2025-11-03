// @ts-nocheck
import React from 'react';

const ExpenseDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/Expenses/ExpenseDeleteAlert'),
);
const ExpensePublishAlert = React.lazy(
  () => import('@/containers/Alerts/Expenses/ExpensePublishAlert'),
);

const ExpenseBulkDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/Expenses/ExpenseBulkDeleteAlert'),
);

/**
 * Accounts alert.
 */
export default [
  { name: 'expense-delete', component: ExpenseDeleteAlert },
  { name: 'expense-publish', component: ExpensePublishAlert },
  { name: 'expenses-bulk-delete', component: ExpenseBulkDeleteAlert },
];
