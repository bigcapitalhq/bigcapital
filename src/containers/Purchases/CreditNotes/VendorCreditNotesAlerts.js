import React from 'react';

const VendorCreditNoteDeleteAlert = React.lazy(() =>
  import('../../Alerts/VendorCeditNotes/VendorCreditNoteDeleteAlert'),
);

/**
 * Vendor Credit notes alerts.
 */
export default [
  {
    name: 'vendor-credit-note-delete',
    component: VendorCreditNoteDeleteAlert,
  },
];
