import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Menu, MenuDivider, MenuItem } from '@blueprintjs/core';

import { safeCallback } from 'utils';
import { Icon } from 'components';

/**
 * Context menu of Branches.
 */
export function ActionsMenu({
  payload: { onEdit, onDelete },
  row: { original },
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('branches.action.edit_branch')}
        onClick={safeCallback(onEdit, original)}
      />
      <MenuDivider />
      <MenuItem
        icon={<Icon icon="trash-16" iconSize={16} />}
        text={intl.get('branches.action.delete_branch')}
        onClick={safeCallback(onDelete, original)}
        intent={Intent.DANGER}
      />
    </Menu>
  );
}

/**
 * Retrieve branches table columns
 * @returns
 */
export function useBranchesTableColumns() {
  return React.useMemo(
    () => [
      {
        id: 'name',
        Header: intl.get('branches.column.branch_name'),
        accessor: 'name',
        className: 'name',
        width: '120',
        disableSortBy: true,
        textOverview: true,
      },
      {
        id: 'code',
        Header: intl.get('branches.column.code'),
        accessor: 'code',
        className: 'code',
        width: '100',
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('branches.column.address'),
        accessor: 'address',
        className: 'address',
        width: '180',
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('branches.column.phone_number'),
        accessor: 'phone_number',
        className: 'phone_number',
        width: '120',
        disableSortBy: true,
      },
    ],
    [],
  );
}
