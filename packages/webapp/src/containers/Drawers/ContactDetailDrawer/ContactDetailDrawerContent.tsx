// @ts-nocheck
import React from 'react';

import ContactDetail from './ContactDetail';
import { ContactDetailDrawerProvider } from './ContactDetailDrawerProvider';

import '@/style/components/Drawers/ViewDetail/ViewDetail.scss';

/**
 * Contact detail drawer content.
 */
export default function ContactDetailDrawerContent({
  // #ownProp
  contact,
}) {
  return (
    <ContactDetailDrawerProvider contactId={contact}>
      <ContactDetail />
    </ContactDetailDrawerProvider>
  );
}
