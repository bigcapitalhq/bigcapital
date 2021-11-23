import React from 'react';
import intl from 'react-intl-universal';

import { DataTable } from 'components';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';

import { useRolesTableColumns, ActionsMenu } from './components';
import withAlertsActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Roles data table.
 */
function RolesDataTable({
  // #withAlertsActions
  openAlert,
}) {
  const columns = useRolesTableColumns();

  const handleDeleteRole = ({ id }) => {
    openAlert('role-delete', { roleId: id });
  };

  // const Data = [{ name: 'AH', description: 'Description' }];
  return (
    <DataTable
      columns={columns}
      data={[]}
      // loading={}
      // progressBarLoading={}
      TableLoadingRenderer={TableSkeletonRows}
      ContextMenu={ActionsMenu}
      payload={{
        onDeleteRole: handleDeleteRole,
      }}
    />
  );
}

export default compose(withAlertsActions)(RolesDataTable);
