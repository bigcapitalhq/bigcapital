// @ts-nocheck
import React from 'react';

const RoleDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/Roles/RoleDeleteAlert'),
);

/**
 * Roles alerts
 */
export default [{ name: 'role-delete', component: RoleDeleteAlert }];
