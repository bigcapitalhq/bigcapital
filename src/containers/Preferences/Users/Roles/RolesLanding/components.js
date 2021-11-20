import React from 'react';
import intl from 'react-intl-universal';

import { Intent, Button, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import { safeInvoke } from 'utils';
import { Icon, If } from 'components';

/**
 * Context menu of roles.
 */
export function ActionsMenu({ payload: {}, row: { original } }) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('roles.edit_roles')}
      />
      <MenuDivider />
      <MenuItem
        icon={<Icon icon="trash-16" iconSize={16} />}
        text={intl.get('roles.delete_roles')}
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
        // accessor: ,
        className: 'name',
        width: '100',
        disableSortBy: true,
      },
      {
        id: 'description',
        Header: intl.get('roles.column.description'),
        // accessor: ,
        className: 'description',
        width: '120',
        disableSortBy: true,
      },
    ],
    [],
  );
}
