import React from 'react';

const BranchDeleteAlert = React.lazy(() =>
  import('../../Alerts/Branches/BranchDeleteAlert'),
);

export default [{ name: 'branch-delete', component: BranchDeleteAlert }];
