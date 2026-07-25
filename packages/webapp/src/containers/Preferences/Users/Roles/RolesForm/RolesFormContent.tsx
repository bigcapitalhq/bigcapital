import { Form } from 'formik';
import React from 'react';
import { RolesPermissionList } from './components';
import { RoleFormFloatingActions } from './RoleFormFloatingActions';
import { RoleFormHeader } from './RoleFormHeader';
import { RoleFormObserver } from './RoleFormObserver';

/**
 * Preferences - Roles Form content.
 */
export function RolesFormContent() {
  return (
    <Form>
      <RoleFormHeader />
      <RolesPermissionList />
      <RoleFormFloatingActions />
      <RoleFormObserver />
    </Form>
  );
}
