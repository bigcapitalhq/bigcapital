// @ts-nocheck
import React from 'react';
import { DrawerHeaderContent, DashboardInsider } from '@/components';
import { useContact } from '@/hooks/query';

const ContactDetailDrawerContext = React.createContext();

/**
 * Contact detail provider.
 */
function ContactDetailDrawerProvider({ contactId, ...props }) {
  // Handle fetch contact duplicate details.
  const { data: contact, isLoading: isContactLoading } = useContact(contactId, {
    enabled: !!contactId,
  });
  //provider.
  const provider = {
    contact,
    contactId,
  };

  return (
    <DashboardInsider loading={isContactLoading}>
      <DrawerHeaderContent
        name="contact-detail-drawer"
        title={contact?.display_name}
      />

      <ContactDetailDrawerContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useContactDetailDrawerContext = () =>
  React.useContext(ContactDetailDrawerContext);

export { ContactDetailDrawerProvider, useContactDetailDrawerContext };
