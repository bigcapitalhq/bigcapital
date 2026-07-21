// @ts-nocheck
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

  return <FormikObserver onChange={handleFormChange} values={values} />;
}
