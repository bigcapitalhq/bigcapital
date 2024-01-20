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

export default [
  { name: 'account-delete', component: AccountDeleteAlert },
  { name: 'account-inactivate', component: AccountInactivateAlert },
  { name: 'account-activate', component: AccountActivateAlert },
];
