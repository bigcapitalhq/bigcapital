import React from 'react';

const RoleDeleteAlert = React.lazy(() =>
  import('@/containers/Alerts/Roles/RoleDeleteAlert').then((m) => ({
    default: m.RoleDeleteAlert,
  })),
);

/**
 * Roles alerts
 */
export const RolesAlerts = [
  { name: 'role-delete', component: RoleDeleteAlert },
];
