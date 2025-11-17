// @ts-nocheck
import React from 'react';

const ReceiptDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/Receipts/ReceiptDeleteAlert'),
);
const ReceiptCloseAlert = React.lazy(
  () => import('@/containers/Alerts/Receipts/ReceiptCloseAlert'),
);
const ReceiptBulkDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/Receipts/ReceiptBulkDeleteAlert'),
);

/**
 * Receipts alerts.
 */
export default [
  { name: 'receipt-delete', component: ReceiptDeleteAlert },
  { name: 'receipt-close', component: ReceiptCloseAlert },
  { name: 'receipts-bulk-delete', component: ReceiptBulkDeleteAlert },
];
