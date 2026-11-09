import React from 'react';
import { AccountantFormPage } from './AccountantFormPage';
import { AccountantFormProvider } from './AccountantFormProvider';

/**
 * Accountant preferences.
 */
export function AccountantPreferences() {
  return (
    <AccountantFormProvider>
      <AccountantFormPage />
    </AccountantFormProvider>
  );
}
