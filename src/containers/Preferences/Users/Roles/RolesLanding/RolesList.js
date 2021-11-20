import React from 'react';
import intl from 'react-intl-universal';

import { RolesListProvider } from './RolesListProvider';
import RolesDataTable from './RolesDataTable';

/**
 * Roles list.
 */
function RolesListPrefernces() {
  return (
    <RolesListProvider>
      <RolesDataTable />
    </RolesListProvider>
  );
}

export default RolesListPrefernces;
