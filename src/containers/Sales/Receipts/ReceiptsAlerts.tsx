// @ts-nocheck
import React from 'react';

const ReceiptDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/Receipts/ReceiptDeleteAlert'),
);
const ReceiptCloseAlert = React.lazy(
  () => import('@/containers/Alerts/Receipts/ReceiptCloseAlert'),
);

/**
 * Receipts alerts.
 */
export default [
  { name: 'receipt-delete', component: ReceiptDeleteAlert },
  { name: 'receipt-close', component: ReceiptCloseAlert },
];
