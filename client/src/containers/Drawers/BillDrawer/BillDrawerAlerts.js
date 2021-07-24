import React from 'react';
import BillTransactionDeleteAlert from 'containers/Alerts/Bills/BillTransactionDeleteAlert';

/**
 * Bill drawer alert.
 */
export default function BillDrawerAlerts() {
  return (
    <div class="bills-alerts">
      <BillTransactionDeleteAlert name="transaction-delete" />
    </div>
  );
}
