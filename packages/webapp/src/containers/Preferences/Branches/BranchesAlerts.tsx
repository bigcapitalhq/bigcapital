import React from 'react';

const BranchDeleteAlert = React.lazy(() =>
  import('@/containers/Alerts/Branches/BranchDeleteAlert').then((m) => ({
    default: m.BranchDeleteAlert,
  })),
);

export const BranchesAlerts = [
  { name: 'branch-delete', component: BranchDeleteAlert },
];
