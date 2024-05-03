// @ts-nocheck
import React from 'react';

import GeneralFormPage from './NewItemFormPage';
import { GeneralFormProvider } from './NewItemFormProvider';

/**
 * Preferences - General form.
 */
export default function GeneralPreferences() {
  return (
    <GeneralFormProvider>
      <GeneralFormPage />
    </GeneralFormProvider>
  );
}
