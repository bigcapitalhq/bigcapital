// @ts-nocheck
import React from 'react';

import { CustomFieldsListProvider } from './CustomFieldsListProvider';
import CustomFieldsDataTable from './CustomFieldsDataTable';

/**
 * Custom fields list.
 */
function CustomFieldsList() {
  return (
    <CustomFieldsListProvider>
      <CustomFieldsDataTable />
    </CustomFieldsListProvider>
  );
}

export default CustomFieldsList;
