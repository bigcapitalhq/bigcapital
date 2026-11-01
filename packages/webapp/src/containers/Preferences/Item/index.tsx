import React from 'react';
import { ItemPreferencesFormPage } from './ItemPreferencesFormPage';
import { ItemPreferencesFormProvider } from './ItemPreferencesFormProvider';

export function ItemsPreferences(): React.ReactElement {
  return (
    <ItemPreferencesFormProvider>
      <ItemPreferencesFormPage />
    </ItemPreferencesFormProvider>
  );
}
