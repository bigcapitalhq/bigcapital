import React from 'react';

const BillOpenAlert = React.lazy(() =>
  import('@/containers/Alerts/Bills/BillOpenAlert').then((m) => ({
    default: m.BillOpenAlert,
  })),
);
const BillDeleteAlert = React.lazy(() =>
  import('@/containers/Alerts/Bills/BillDeleteAlert').then((m) => ({
    default: m.BillDeleteAlert,
  })),
);

const BillLocatedLandedCostDeleteAlert = React.lazy(() =>
  import('@/containers/Alerts/Bills/BillLocatedLandedCostDeleteAlert').then(
    (m) => ({ default: m.BillLocatedLandedCostDeleteAlert }),
  ),
);

export const BillsAlerts = [
  { name: 'bill-delete', component: BillDeleteAlert },
  { name: 'bill-open', component: BillOpenAlert },
  {
    name: 'bill-located-cost-delete',
    component: BillLocatedLandedCostDeleteAlert,
  },
];
