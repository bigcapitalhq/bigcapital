import React from 'react';
import BillOpenAlert from 'containers/Alerts/Bills/BillOpenAlert';
import BillDeleteAlert from 'containers/Alerts/Bills/BillDeleteAlert';

export default function BillsAlerts() {
  return (
    <div class="bills-alerts">
      <BillDeleteAlert name={'bill-delete'} />
      <BillOpenAlert name={'bill-open'} />
    </div>
  );
}
