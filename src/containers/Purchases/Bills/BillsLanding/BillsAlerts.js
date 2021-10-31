import React from 'react';

const BillOpenAlert = React.lazy(() =>
  import('containers/Alerts/Bills/BillOpenAlert'),
);
const BillDeleteAlert = React.lazy(() =>
  import('containers/Alerts/Bills/BillDeleteAlert'),
);

export default [
  { name: 'bill-delete', component: BillDeleteAlert },
  { name: 'bill-open', component: BillOpenAlert },
];
