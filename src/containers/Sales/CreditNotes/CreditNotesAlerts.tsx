// @ts-nocheck
import React from 'react';

const CreditNoteDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/CreditNotes/CreditNoteDeleteAlert'),
);

const RefundCreditNoteDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/CreditNotes/RefundCreditNoteDeleteAlert'),
);

const OpenCreditNoteAlert = React.lazy(
  () => import('@/containers/Alerts/CreditNotes/CreditNoteOpenedAlert'),
);

const ReconcileCreditDeleteAlert = React.lazy(
  () =>
    import('@/containers/Alerts/CreditNotes/ReconcileCreditNoteDeleteAlert'),
);

/**
 * Credit notes alerts.
 */
export default [
  {
    name: 'credit-note-delete',
    component: CreditNoteDeleteAlert,
  },
  {
    name: 'credit-note-open',
    component: OpenCreditNoteAlert,
  },
  {
    name: 'refund-credit-delete',
    component: RefundCreditNoteDeleteAlert,
  },
  {
    name: 'reconcile-credit-delete',
    component: ReconcileCreditDeleteAlert,
  },
];
