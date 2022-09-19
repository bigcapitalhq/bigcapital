// @ts-nocheck
import React from 'react';

const AccountDeleteTransactionAlert = React.lazy(
  () => import('@/containers/Alerts/CashFlow/AccountDeleteTransactionAlert'),
);

/**
 * Account transaction alert.
 */
export default [
  {
    name: 'account-transaction-delete',
    component: AccountDeleteTransactionAlert,
  },
];
