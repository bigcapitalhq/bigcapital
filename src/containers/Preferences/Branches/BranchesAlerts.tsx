// @ts-nocheck
import React from 'react';

const BranchDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/Branches/BranchDeleteAlert'),
);

export default [{ name: 'branch-delete', component: BranchDeleteAlert }];
