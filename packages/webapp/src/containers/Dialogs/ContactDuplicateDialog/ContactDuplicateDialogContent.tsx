// @ts-nocheck
import React from 'react';

import ContactDuplicateForm from './ContactDuplicateForm';
import { ContactDuplicateProvider } from './ContactDuplicateProvider';

import '@/style/pages/ContactDuplicate/ContactDuplicateDialog.scss';

export default function ContactDuplicateDialogContent({
  // #ownProp
  contact,
  dialogName,
}) {
  return (
    <ContactDuplicateProvider dialogName={dialogName} contactId={contact}>
      <ContactDuplicateForm />
    </ContactDuplicateProvider>
  );
}
