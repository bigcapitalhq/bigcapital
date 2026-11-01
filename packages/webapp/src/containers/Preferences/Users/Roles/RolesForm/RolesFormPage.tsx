import React from 'react';
import { useParams } from 'react-router-dom';
import { RolesForm } from './RolesForm';
import { RolesFormProvider } from './RolesFormProvider';

/**
 * Roles Form page.
 */
export function RolesFormPage() {
  const { id } = useParams<{ id?: string }>();
  const idInteger = id ? parseInt(id, 10) : NaN;

  return (
    <RolesFormProvider roleId={Number.isNaN(idInteger) ? undefined : idInteger}>
      <RolesForm />
    </RolesFormProvider>
  );
}
