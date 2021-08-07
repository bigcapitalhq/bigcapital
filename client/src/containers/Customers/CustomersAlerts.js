import React from 'react';
import CustomerDeleteAlert from 'containers/Alerts/Customers/CustomerDeleteAlert';
// import CustomerBulkDeleteAlert from 'containers/Alerts/Customers/CustomerBulkDeleteAlert';
import ContactActivateAlert from '../../containers/Alerts/Contacts/ContactActivateAlert';
import ContactInactivateAlert from '../../containers/Alerts/Contacts/ContactInactivateAlert';

/**
 * Customers alert.
 */
export default function ItemsAlerts() {
  return (
    <div>
      <CustomerDeleteAlert name={'customer-delete'} />
      <ContactActivateAlert name={'contact-activate'} />
      <ContactInactivateAlert name={'contact-inactivate'} />
      {/* <CustomerBulkDeleteAlert name={'customers-bulk-delete'} /> */}
    </div>
  );
}
