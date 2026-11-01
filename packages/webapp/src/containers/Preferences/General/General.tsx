import React from 'react';
import { GeneralFormPage } from './GeneralFormPage';
import { GeneralFormProvider } from './GeneralFormProvider';

/**
 * Preferences - General form.
 */
export function GeneralPreferences() {
  return (
    <GeneralFormProvider>
      <GeneralFormPage />
    </GeneralFormProvider>
  );
}
