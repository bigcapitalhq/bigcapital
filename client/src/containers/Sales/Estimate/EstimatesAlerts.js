import React from 'react';
import EstimateDeleteAlert from 'containers/Alerts/Estimates/EstimateDeleteAlert';
import EstimateDeliveredAlert from 'containers/Alerts/Estimates/EstimateDeliveredAlert';
import EstimateApproveAlert from 'containers/Alerts/Estimates/EstimateApproveAlert';
import EstimateRejectAlert from 'containers/Alerts/Estimates/EstimateRejectAlert';

/**
 * Estimates alert.
 */
export default function EstimatesAlerts() {
  return (
    <div>
      <EstimateDeleteAlert name={'estimate-delete'} />
      <EstimateDeliveredAlert name={'estimate-deliver'} />
      <EstimateApproveAlert name={'estimate-Approve'} />
      <EstimateRejectAlert name={'estimate-reject'} />
    </div>
  );
}
