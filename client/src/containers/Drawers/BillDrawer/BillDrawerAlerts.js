import React from 'react';
import BillLocatedLandedCostDeleteAlert from 'containers/Alerts/Bills/BillLocatedLandedCostDeleteAlert';

/**
 * Bill drawer alert.
 */
export default function BillDrawerAlerts() {
  return (
    <div class="bills-alerts">
      <BillLocatedLandedCostDeleteAlert name="bill-located-cost-delete" />
    </div>
  );
}
