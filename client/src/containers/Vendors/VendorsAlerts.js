import React from 'react';
import VendorDeleteAlert from 'containers/Alerts/Vendors/VendorDeleteAlert';
import ContactActivateAlert from '../../containers/Alerts/Contacts/ContactActivateAlert';
import ContactInactivateAlert from '../../containers/Alerts/Contacts/ContactInactivateAlert';

export default function VendorsAlerts() {
  return (
    <div>
      <VendorDeleteAlert name={'vendor-delete'} />
      <ContactActivateAlert name={'contact-activate'} />
      <ContactInactivateAlert name={'contact-inactivate'} />
    </div>
  );
}
