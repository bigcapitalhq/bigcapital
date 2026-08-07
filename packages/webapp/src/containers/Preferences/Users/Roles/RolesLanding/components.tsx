import { Intent, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { Icon } from '@/components';
import { safeCallback } from '@/utils';

interface ActionsMenuPayload {
  onDeleteRole: (role: { id: number; predefined: boolean }) => void;
  onEditRole: (role: { id: number; predefined: boolean }) => void;
}

interface ActionsMenuProps {
  payload: ActionsMenuPayload;
  row: { original: Record<string, any> };
}

export function ActionsMenu({
  payload: { onDeleteRole, onEditRole },
  row: { original },
}: ActionsMenuProps) {
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
