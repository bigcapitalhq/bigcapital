import React from 'react';
import { useHistory } from 'react-router-dom';

import intl from 'react-intl-universal';

import { DataTable } from 'components';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';

import { useRolesTableColumns, ActionsMenu } from './components';
import withAlertsActions from 'containers/Alert/withAlertActions';
import { useRolesContext } from './RolesListProvider';

import { compose } from 'utils';

/**
 * Roles data table.
 */
function RolesDataTable({
  // #withAlertsActions
  openAlert,
}) {
  // History context.
  const history = useHistory();

  const columns = useRolesTableColumns();

  const { roles, isRolesFetching, isRolesLoading } = useRolesContext();

  const handleDeleteRole = ({ id }) => {
    openAlert('role-delete', { roleId: id });
  };

  const handleEditRole = ({ id }) => {
    history.push(`/preferences/roles/${id}`);
  };

  return (
    <DataTable
      columns={columns}
      data={roles}
      loading={isRolesLoading}
      headerLoading={isRolesFetching}
      progressBarLoading={isRolesFetching}
      TableLoadingRenderer={TableSkeletonRows}
      ContextMenu={ActionsMenu}
      payload={{
        onDeleteRole: handleDeleteRole,
        onEditRole: handleEditRole,
      }}
    />
  );
}

export default compose(withAlertsActions)(RolesDataTable);
