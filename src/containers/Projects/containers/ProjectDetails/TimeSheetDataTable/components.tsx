import React from 'react';
import intl from 'react-intl-universal';
import { FormatDateCell, Icon } from 'components';
import { Menu, MenuDivider, MenuItem, Intent } from '@blueprintjs/core';
import { safeCallback } from 'utils';

/**
 * Table actions cell.
 */

export function ActionsMenu({
  payload: { onDelete, onViewDetails },
  row: { original },
}) {
  return (
    <Menu>
      <MenuItem
        text={'Delete'}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
        icon={<Icon icon="trash-16" iconSize={16} />}
      />
    </Menu>
  );
}

/**
 * Retrieve timesheet list columns columns.
 */
export function useTimesheetColumns() {
  return React.useMemo(
    () => [
      {
        id: 'date',
        Header: intl.get('timesheets.column.date'),
        accessor: 'date',
        Cell: FormatDateCell,
        width: 100,
        className: 'date',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'task',
        Header: intl.get('timesheets.column.task'),
        accessor: 'task',
        width: 100,
        className: 'task',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'user',
        Header: intl.get('timesheets.column.user'),
        accessor: 'user',
        width: 100,
        className: 'user',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'time',
        Header: intl.get('timesheets.column.time'),
        accessor: 'time',
        width: 100,
        className: 'user',
        align: 'right',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'billingStatus',
        Header: intl.get('timesheets.column.billing_status'),
        accessor: 'billing_status',
        width: 140,
        className: 'billingStatus',
        clickable: true,
        textOverview: true,
      },
    ],
    [],
  );
}
