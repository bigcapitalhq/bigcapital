// @ts-nocheck
import React from 'react';

const AccountDeleteTransactionAlert = React.lazy(
  () => import('@/containers/Alerts/CashFlow/AccountDeleteTransactionAlert'),
);
const EditCategorizationAlert = React.lazy(
  () => import('@/containers/Alerts/CashFlow/EditCategorizationAlert'),
);

/**
 * Account transaction alert.
 */
export default [
  {
    name: 'account-transaction-delete',
    component: AccountDeleteTransactionAlert,
  },
  {
    name: 'edit-categorization',
    component: EditCategorizationAlert,
  },
];
