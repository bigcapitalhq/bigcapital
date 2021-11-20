import React from 'react';
import intl from 'react-intl-universal';

import { DataTable } from 'components';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';

import { useRolesTableColumns, ActionsMenu } from './components';

import { compose } from 'utils';

/**
 * Roles data table.
 */
export default function RolesDataTable() {
  const columns = useRolesTableColumns();

  return (
    <DataTable
      columns={columns}
      data={[]}
      // loading={}
      // progressBarLoading={}
      TableLoadingRenderer={TableSkeletonRows}
      ContextMenu={ActionsMenu}
      // payload={{}}
    />
  );
}
