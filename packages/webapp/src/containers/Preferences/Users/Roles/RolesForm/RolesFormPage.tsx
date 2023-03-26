// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';
import { RolesFormProvider } from './RolesFormProvider';
import RolesForm from './RolesForm';

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
