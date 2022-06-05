import React from 'react';
import { useParams } from 'react-router-dom';
import RolesForm from './RolesForm';
import { RolesFormProvider } from './RolesFormProvider';

/**
 * Roles Form page.
 */
export default function RolesFormPage() {
  const { id } = useParams();
  const idInteger = parseInt(id, 10);

  return (
    <RolesFormProvider roleId={idInteger}>
      <RolesForm />
    </RolesFormProvider>
  );
}
