import React from 'react';

const CustomerDeleteAlert = React.lazy(() =>
  import('../Alerts/Customers/CustomerDeleteAlert'),
);
const ContactActivateAlert = React.lazy(() =>
  import('../Alerts/Contacts/ContactActivateAlert'),
);
const ContactInactivateAlert = React.lazy(() =>
  import('../Alerts/Contacts/ContactInactivateAlert'),
);

/**
 * Customers alert.
 */
export default [
  { name: 'customer-delete', component: CustomerDeleteAlert },
  { name: 'contact-activate', component: ContactActivateAlert },
  { name: 'contact-inactivate', component: ContactInactivateAlert },
];
