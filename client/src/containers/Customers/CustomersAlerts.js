import React from 'react';
import CustomerDeleteAlert from 'containers/Alerts/Customers/CustomerDeleteAlert';
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
    </div>
  );
}
