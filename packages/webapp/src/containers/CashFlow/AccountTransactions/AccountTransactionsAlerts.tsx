import React, { ComponentType, LazyExoticComponent } from 'react';

const AccountDeleteTransactionAlert: LazyExoticComponent<ComponentType> =
  React.lazy(() =>
    import('@/containers/Alerts/CashFlow/AccountDeleteTransactionAlert').then(
      (m) => ({ default: m.AccountDeleteTransactionAlert }),
    ),
  );

interface AccountTransactionAlertEntry {
  name: string;
  component: LazyExoticComponent<ComponentType>;
}

/**
 * Account transaction alert.
 */
export const AccountTransactionsAlerts: AccountTransactionAlertEntry[] = [
  {
    name: 'account-transaction-delete',
    component: AccountDeleteTransactionAlert,
  },
];
