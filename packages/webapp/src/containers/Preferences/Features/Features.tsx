import React from 'react';
import { FeaturesFormPage } from './FeaturesFormPage';
import { FeaturesFormProvider } from './FeaturesFormProvider';

/**
 * Features preferences.
 */
export function FeaturesPreferences() {
  return (
    <FeaturesFormProvider>
      <FeaturesFormPage />
    </FeaturesFormProvider>
  );
}
