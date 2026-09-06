import React from 'react';

const ReceiptDeleteAlert = React.lazy(() =>
  import('@/containers/Alerts/Receipts/ReceiptDeleteAlert').then((m) => ({
    default: m.ReceiptDeleteAlert,
  })),
);
const ReceiptCloseAlert = React.lazy(() =>
  import('@/containers/Alerts/Receipts/ReceiptCloseAlert').then((m) => ({
    default: m.ReceiptCloseAlert,
  })),
);
/**
 * Receipts alerts.
 */
export const ReceiptsAlerts = [
  { name: 'receipt-delete', component: ReceiptDeleteAlert },
  { name: 'receipt-close', component: ReceiptCloseAlert },
];
