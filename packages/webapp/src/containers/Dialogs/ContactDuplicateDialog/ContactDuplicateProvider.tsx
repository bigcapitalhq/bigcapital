import React, { createContext } from 'react';
import type { ContactDuplicateContextValue } from './types';
import { DialogContent } from '@/components';

const ContactDuplicateContext = createContext<ContactDuplicateContextValue>(
  {} as ContactDuplicateContextValue,
);

interface ContactDuplicateProviderProps {
  contactId?: number | null;
  dialogName: string;
  children?: React.ReactNode;
}

/**
 *  contact duplicate provider.
 */
function ContactDuplicateProvider({
  contactId,
  dialogName,
  ...props
}: ContactDuplicateProviderProps) {
  // Provider state.
  const provider: ContactDuplicateContextValue = {
    dialogName,
    contactId,
  };

  return (
    <DialogContent name={'contact-duplicate'}>
      <ContactDuplicateContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useContactDuplicateFromContext = () =>
  React.useContext(ContactDuplicateContext);

export { ContactDuplicateProvider, useContactDuplicateFromContext };
