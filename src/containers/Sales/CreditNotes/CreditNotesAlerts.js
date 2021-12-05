import React from 'react';

const CreditNoteDeleteAlert = React.lazy(() =>
  import('../../Alerts/CreditNotes/CreditNoteDeleteAlert'),
);

const RefundCreditNoteDeleteAlert = React.lazy(() =>
  import('../../Alerts/CreditNotes/RefundCreditNoteDeleteAlert'),
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
    name: 'refund-credit-delete',
    component: RefundCreditNoteDeleteAlert,
  },
];
