import React from 'react';
import { ContactDuplicateForm } from './ContactDuplicateForm';
import { ContactDuplicateProvider } from './ContactDuplicateProvider';

import '@/style/pages/ContactDuplicate/ContactDuplicateDialog.scss';

interface ContactDuplicateDialogContentProps {
  contact?: number | null;
  dialogName: string;
}

export function ContactDuplicateDialogContent({
  // #ownProp
  contact,
  dialogName,
}: ContactDuplicateDialogContentProps): React.ReactElement {
  return (
    <ContactDuplicateProvider dialogName={dialogName} contactId={contact}>
      <ContactDuplicateForm />
    </ContactDuplicateProvider>
  );
}
