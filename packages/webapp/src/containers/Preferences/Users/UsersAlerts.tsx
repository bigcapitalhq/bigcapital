import React from 'react';

const UserDeleteAlert = React.lazy(() =>
  import('@/containers/Alerts/Users/UserDeleteAlert').then((m) => ({
    default: m.UserDeleteAlert,
  })),
);
const UserActivateAlert = React.lazy(() =>
  import('@/containers/Alerts/Users/UserActivateAlert').then((m) => ({
    default: m.UserActivateAlert,
  })),
);
const UserInactivateAlert = React.lazy(() =>
  import('@/containers/Alerts/Users/UserInactivateAlert').then((m) => ({
    default: m.UserInactivateAlert,
  })),
);

export const UsersAlerts = [
  { name: 'user-delete', component: UserDeleteAlert },
  { name: 'user-activate', component: UserActivateAlert },
  { name: 'user-inactivate', component: UserInactivateAlert },
];
