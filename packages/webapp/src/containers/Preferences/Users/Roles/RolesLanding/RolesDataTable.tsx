import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { DataTable, AppToaster, TableSkeletonRows } from '@/components';
import { useRolesTableColumns, ActionsMenu } from './components';
import {
  withAlertActions,
  type WithAlertActionsProps,
} from '@/containers/Alert/withAlertActions';
import { useRolesContext } from './RolesListProvider';
import { flow } from 'fp-ts/function';

/**
 * Roles data table.
 */
function RolesDataTableInner({
  // #withAlertActions
  openAlert,
}: WithAlertActionsProps) {
  const history = useHistory();

  const columns = useRolesTableColumns();

  const { roles, isRolesFetching, isRolesLoading } = useRolesContext();

  const handleDeleteRole = ({
    id,
    predefined,
  }: {
    id: number;
    predefined: boolean;
  }) => {
    if (predefined) {
      AppToaster.show({
        message: intl.get('roles.error.you_cannot_delete_predefined_roles'),
        intent: Intent.DANGER,
      });
    } else {
      openAlert('role-delete', { roleId: id });
    }
  };
  const handleEditRole = ({
    id,
    predefined,
  }: {
    id: number;
    predefined: boolean;
  }) => {
    if (predefined) {
      AppToaster.show({
        message: intl.get('roles.error.you_cannot_edit_predefined_roles'),
        intent: Intent.DANGER,
      });
    } else {
      history.push(`/preferences/roles/${id}`);
    }
  };

  return (
    <RolesTable
      columns={columns}
      data={roles ?? []}
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

const RolesTable = styled(DataTable)`
  .table .tr {
    min-height: 42px;
  }
`;

export const RolesDataTable = flow(withAlertActions)(
  RolesDataTableInner,
);
