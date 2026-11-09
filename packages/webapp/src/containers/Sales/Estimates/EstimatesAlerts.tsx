import React from 'react';

const EstimateDeleteAlert = React.lazy(() =>
  import('@/containers/Alerts/Estimates/EstimateDeleteAlert').then((m) => ({
    default: m.EstimateDeleteAlert,
  })),
);
const EstimateDeliveredAlert = React.lazy(() =>
  import('@/containers/Alerts/Estimates/EstimateDeliveredAlert').then((m) => ({
    default: m.EstimateDeliveredAlert,
  })),
);
const EstimateApproveAlert = React.lazy(() =>
  import('@/containers/Alerts/Estimates/EstimateApproveAlert').then((m) => ({
    default: m.EstimateApproveAlert,
  })),
);
const EstimateRejectAlert = React.lazy(() =>
  import('@/containers/Alerts/Estimates/EstimateRejectAlert').then((m) => ({
    default: m.EstimateRejectAlert,
  })),
);

/**
 * Estimates alert.
 */
export const EstimatesAlerts = [
  { name: 'estimate-delete', component: EstimateDeleteAlert },
  { name: 'estimate-deliver', component: EstimateDeliveredAlert },
  { name: 'estimate-Approve', component: EstimateApproveAlert },
  { name: 'estimate-reject', component: EstimateRejectAlert },
];
