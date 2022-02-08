import React from 'react';

const BranchDeleteAlert = React.lazy(() =>
  import('../../Alerts/Branches/BranchDeleteAlert'),
);
const BranchMarkPrimaryAlert = React.lazy(() =>
  import('../../Alerts/Branches/BranchMarkPrimaryAlert'),
);

export default [
  { name: 'branch-delete', component: BranchDeleteAlert },
  {
    name: 'branch-mark-primary',
    component: BranchMarkPrimaryAlert,
  },
];
