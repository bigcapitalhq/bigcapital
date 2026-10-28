import React from 'react';
import { ContactsPreferencesFormPage } from './ContactsPreferencesFormPage';
import { ContactsPreferencesFormProvider } from './ContactsPreferencesFormProvider';

/**
 * Contacts number preferences page.
 */
export function ContactsPreferences(): React.ReactElement {
  return (
    <ContactsPreferencesFormProvider>
      <ContactsPreferencesFormPage />
    </ContactsPreferencesFormProvider>
  );
}
