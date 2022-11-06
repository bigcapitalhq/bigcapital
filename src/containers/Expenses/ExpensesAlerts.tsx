// @ts-nocheck
import React from 'react';

const ExpenseDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/Expenses/ExpenseDeleteAlert'),
);
const ExpensePublishAlert = React.lazy(
  () => import('@/containers/Alerts/Expenses/ExpensePublishAlert'),
);

/**
 * Accounts alert.
 */
export default [
  { name: 'expense-delete', component: ExpenseDeleteAlert },
  { name: 'expense-publish', component: ExpensePublishAlert },
];
