import React from 'react';

const AccountDeleteTransactionAlert = React.lazy(() =>
  import('../../Alerts/CashFlow/AccountDeleteTransactionAlert'),
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
