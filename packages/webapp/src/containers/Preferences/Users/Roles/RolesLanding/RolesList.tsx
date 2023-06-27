// @ts-nocheck
import React from 'react';

import { RolesListProvider } from './RolesListProvider';
import RolesDataTable from './RolesDataTable';

/**
 * Roles list.
 */
function RolesListPreferences() {
  return (
    <RolesListProvider>
      <RolesDataTable />
    </RolesListProvider>
  );
}

export default RolesListPreferences;
