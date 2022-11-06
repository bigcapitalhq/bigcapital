// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Menu, MenuDivider, MenuItem } from '@blueprintjs/core';

import { safeCallback } from '@/utils';
import { Icon, If } from '@/components';

/**
 * Context menu of Branches.
 */
export function ActionsMenu({
  payload: { onEdit, onDelete, onMarkPrimary },
  row: { original },
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('branches.action.edit_branch')}
        onClick={safeCallback(onEdit, original)}
      />
      <If condition={!original.primary}>
        <MenuItem
          icon={<Icon icon={'check'} iconSize={18} />}
          text={intl.get('branches.action.mark_as_primary')}
          onClick={safeCallback(onMarkPrimary, original)}
        />
      </If>
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
 * Branch name cell.
 */
function BranchNameCell({ value, row: { original } }) {
  return (
    <span>
      {value} {original.primary && <Icon icon={'star-18dp'} iconSize={16} />}
    </span>
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
        Cell: BranchNameCell,
        width: '120',
        disableSortBy: true,
        textOverview: true,
      },
      {
        id: 'code',
        Header: intl.get('branches.column.code'),
        accessor: 'code',
        width: '100',
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('branches.column.address'),
        accessor: 'address',
        width: '180',
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('branches.column.phone_number'),
        accessor: 'phone_number',
        width: '120',
        disableSortBy: true,
      },
    ],
    [],
  );
}
