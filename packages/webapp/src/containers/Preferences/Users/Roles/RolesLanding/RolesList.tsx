import React from 'react';
import { RolesDataTable } from './RolesDataTable';
import { RolesListProvider } from './RolesListProvider';

/**
 * Roles list.
 */
export function RolesListPrefernces() {
  return (
    <RolesListProvider>
      <RolesDataTable />
    </RolesListProvider>
  );
}
