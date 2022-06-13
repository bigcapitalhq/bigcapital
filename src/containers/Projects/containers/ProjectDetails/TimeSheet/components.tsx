import React from 'react';
import intl from 'react-intl-universal';
import { FormatDateCell } from 'components';
import { Menu, MenuDivider, MenuItem, Intent } from '@blueprintjs/core';

/**
 * Table actions cell.
 */
export const ActionMenu = ({ row: { original }, payload: {} }) => <Menu></Menu>;

/**
 * Retrieve timesheet list columns columns.
 */
export const useTimeSheetColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'date',
        Header: intl.get('timesheets.column.date'),
        accessor: 'date',
        Cell: FormatDateCell,
        width: 115,
        className: 'date',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'task',
        Header: intl.get('timesheets.column.task'),
        accessor: 'task',
        width: 115,
        className: 'task',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'user',
        Header: intl.get('timesheets.column.user'),
        accessor: 'user',
        width: 115,
        className: 'user',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'time',
        Header: intl.get('timesheets.column.time'),
        accessor: 'time',
        width: 115,
        className: 'user',
        align: 'right',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'billingStatus',
        Header: intl.get('timesheets.column.billing_status'),
        accessor: 'billing_status',
        width: 160,
        className: 'billingStatus',
        clickable: true,
        textOverview: true,
      },
    ],
    [],
  );
};
