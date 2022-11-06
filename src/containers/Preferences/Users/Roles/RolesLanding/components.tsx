// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import { Intent, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import { safeCallback } from '@/utils';
import { Icon } from '@/components';

/**
 * Context menu of roles.
 */
export function ActionsMenu({
  payload: { onDeleteRole, onEditRole },
  row: { original },
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('roles.edit_roles')}
        onClick={safeCallback(onEditRole, original)}
      />
      <MenuDivider />
      <MenuItem
        icon={<Icon icon="trash-16" iconSize={16} />}
        text={intl.get('roles.delete_roles')}
        onClick={safeCallback(onDeleteRole, original)}
        intent={Intent.DANGER}
      />
    </Menu>
  );
}

/**
 * Retrieve Roles table columns.
 * @returns
 */
export function useRolesTableColumns() {
  return React.useMemo(
    () => [
      {
        id: 'name',
        Header: intl.get('roles.column.name'),
        accessor: 'name',
        className: 'name',
        width: '80',
        textOverview: true,
      },
      {
        id: 'description',
        Header: intl.get('roles.column.description'),
        accessor: 'description',
        className: 'description',
        width: '180',
        textOverview: true,
      },
    ],
    [],
  );
}
