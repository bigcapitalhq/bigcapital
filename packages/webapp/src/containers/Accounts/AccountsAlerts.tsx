// @ts-nocheck
import React from 'react';

const AccountDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/Accounts/AccountDeleteAlert'),
);
const AccountInactivateAlert = React.lazy(
  () => import('@/containers/Alerts/Accounts/AccountInactivateAlert'),
);
const AccountActivateAlert = React.lazy(
  () => import('@/containers/Alerts/Accounts/AccountActivateAlert'),
);
const AccountBulkActivateAlert = React.lazy(
  () => import('@/containers/Alerts/Accounts/AccountBulkActivateAlert'),
);
const AccountBulkInactivateAlert = React.lazy(
  () => import('@/containers/Alerts/Accounts/AccountBulkInactivateAlert'),
);

export default [
  { name: 'account-delete', component: AccountDeleteAlert },
  { name: 'account-inactivate', component: AccountInactivateAlert },
  { name: 'account-activate', component: AccountActivateAlert },
  { name: 'accounts-bulk-activate', component: AccountBulkActivateAlert },
  { name: 'accounts-bulk-inactivate', component: AccountBulkInactivateAlert },
];
