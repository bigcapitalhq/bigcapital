import React from 'react';
import ReceiptDeleteAlert from 'containers/Alerts/Receipts/ReceiptDeleteAlert';
import ReceiptCloseAlert from 'containers/Alerts/Receipts/ReceiptCloseAlert';

/**
 * Receipts alerts.
 */
export default function ReceiptsAlerts() {
  return (
    <div>
      <ReceiptDeleteAlert name={'receipt-delete'} />
      <ReceiptCloseAlert name={'receipt-close'} />
    </div>
  );
}
