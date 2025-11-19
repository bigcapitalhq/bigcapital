// @ts-nocheck
import React from 'react';

const EstimateDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/Estimates/EstimateDeleteAlert'),
);
const EstimateDeliveredAlert = React.lazy(
  () => import('@/containers/Alerts/Estimates/EstimateDeliveredAlert'),
);
const EstimateApproveAlert = React.lazy(
  () => import('@/containers/Alerts/Estimates/EstimateApproveAlert'),
);
const EstimateRejectAlert = React.lazy(
  () => import('@/containers/Alerts/Estimates/EstimateRejectAlert'),
);

/**
 * Estimates alert.
 */
export default [
  { name: 'estimate-delete', component: EstimateDeleteAlert },
  { name: 'estimate-deliver', component: EstimateDeliveredAlert },
  { name: 'estimate-Approve', component: EstimateApproveAlert },
  { name: 'estimate-reject', component: EstimateRejectAlert },
];
