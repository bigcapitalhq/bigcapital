import React from 'react';

const CreditNoteDeleteAlert = React.lazy(() =>
  import('@/containers/Alerts/CreditNotes/CreditNoteDeleteAlert').then((m) => ({
    default: m.CreditNoteDeleteAlert,
  })),
);

const RefundCreditNoteDeleteAlert = React.lazy(() =>
  import('@/containers/Alerts/CreditNotes/RefundCreditNoteDeleteAlert').then(
    (m) => ({ default: m.RefundCreditNoteDeleteAlert }),
  ),
);

const OpenCreditNoteAlert = React.lazy(() =>
  import('@/containers/Alerts/CreditNotes/CreditNoteOpenedAlert').then((m) => ({
    default: m.CreditNoteOpenedAlert,
  })),
);

const ReconcileCreditDeleteAlert = React.lazy(() =>
  import('@/containers/Alerts/CreditNotes/ReconcileCreditNoteDeleteAlert').then(
    (m) => ({ default: m.ReconcileCreditNoteDeleteAlert }),
  ),
);

/**
 * Credit notes alerts.
 */
export const CreditNotesAlerts = [
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
