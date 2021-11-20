import React from 'react';

import RolesForm from './RolesForm';
import { RolesFormProvider } from './RolesFormProvider';

/**
 * Roles Form page.
 */
export default function RolesFormPage() {
  return (
    <RolesFormProvider>
      <RolesForm />
    </RolesFormProvider>
  );
}
