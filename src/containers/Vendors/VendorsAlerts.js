import React from 'react';

const VendorDeleteAlert = React.lazy(() =>
  import('../Alerts/Vendors/VendorDeleteAlert'),
);
const ContactActivateAlert = React.lazy(() =>
  import('../Alerts/Contacts/ContactActivateAlert'),
);
const ContactInactivateAlert = React.lazy(() =>
  import('../Alerts/Contacts/ContactInactivateAlert'),
);

export default [
  { name: 'vendor-delete', component: VendorDeleteAlert },
  { name: 'contact-activate', component: ContactActivateAlert },
  { name: 'contact-inactivate', component: ContactInactivateAlert },
];
