import React from 'react';

const AccountDeleteAlert = React.lazy(() =>
  import('containers/Alerts/AccountDeleteAlert'),
);
const AccountInactivateAlert = React.lazy(() =>
  import('containers/Alerts/AccountInactivateAlert'),
);
const AccountActivateAlert = React.lazy(() =>
  import('containers/Alerts/AccountActivateAlert'),
);
// import AccountBulkDeleteAlert from 'containers/Alerts/AccountBulkDeleteAlert';
// import AccountBulkInactivateAlert from 'containers/Alerts/AccountBulkInactivateAlert';
// import AccountBulkActivateAlert from 'containers/Alerts/AccountBulkActivateAlert';

export default [
  { name: 'account-delete', component: AccountDeleteAlert },
  { name: 'account-inactivate', component: AccountInactivateAlert },
  { name: 'account-activate', component: AccountActivateAlert },
];
