import React, { ComponentType, LazyExoticComponent } from 'react';

const AccountDeleteAlert = React.lazy(() =>
  import('@/containers/Alerts/Accounts/AccountDeleteAlert').then((m) => ({
    default: m.AccountDeleteAlert,
  })),
);
const AccountInactivateAlert = React.lazy(() =>
  import('@/containers/Alerts/Accounts/AccountInactivateAlert').then((m) => ({
    default: m.AccountInactivateAlert,
  })),
);
const AccountActivateAlert = React.lazy(() =>
  import('@/containers/Alerts/Accounts/AccountActivateAlert').then((m) => ({
    default: m.AccountActivateAlert,
  })),
);
const AccountBulkActivateAlert = React.lazy(() =>
  import('@/containers/Alerts/Accounts/AccountBulkActivateAlert').then((m) => ({
    default: m.AccountBulkActivateAlert,
  })),
);
const AccountBulkInactivateAlert = React.lazy(() =>
  import('@/containers/Alerts/Accounts/AccountBulkInactivateAlert').then(
    (m) => ({ default: m.AccountBulkInactivateAlert }),
  ),
);

interface AlertItem {
  name: string;
  component: LazyExoticComponent<ComponentType<unknown>>;
}

export const AccountsAlerts: AlertItem[] = [
  { name: 'account-delete', component: AccountDeleteAlert },
  { name: 'account-inactivate', component: AccountInactivateAlert },
  { name: 'account-activate', component: AccountActivateAlert },
  { name: 'accounts-bulk-activate', component: AccountBulkActivateAlert },
  { name: 'accounts-bulk-inactivate', component: AccountBulkInactivateAlert },
];
