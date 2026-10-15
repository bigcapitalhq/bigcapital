import { useFormikContext } from 'formik';
import React from 'react';
import type { RolesFormValues } from './types';
import { FormikObserver } from '@/components';

/**
 * Role form observer.
 */
export function RoleFormObserver() {
  const { values } = useFormikContext<RolesFormValues>();

  // Handles the form change.
  const handleFormChange = () => {};

  return (
    <FormikObserver
      onChange={handleFormChange}
      // FormikObserver reads form values from its own Formik context and
      // ignores this prop; spread-cast keeps the runtime props unchanged.
      {...({ values } as { values: RolesFormValues })}
    />
  );
}
