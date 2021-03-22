import React from 'react';
import ItemFormPage from './ItemFormPage';
import { ItemFormProvider } from './ItemFormProvider';

/**
 * items preferences.
 */
export default function ItemsPreferences() {
  return (
    <ItemFormProvider>
      <ItemFormPage />
    </ItemFormProvider>
  );
}
