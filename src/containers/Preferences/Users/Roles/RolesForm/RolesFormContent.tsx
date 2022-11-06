// @ts-nocheck
import React from 'react';
import { Form } from 'formik';

import { RoleFormHeader } from './RoleFormHeader';
import { RolesPermissionList } from './components';
import { RoleFormFloatingActions } from './RoleFormFloatingActions';
import { RoleFormObserver } from './RoleFormObserver';

/**
 * Preferences - Roles Form content.
 * @returns {React.JSX}
 */
export default function RolesFormContent() {
  return (
    <Form>
      <RoleFormHeader />
      <RolesPermissionList />
      <RoleFormFloatingActions />
      <RoleFormObserver />
    </Form>
  );
}
