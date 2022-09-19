// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { AvatarCell, TimesheetAccessor } from './components';

/**
 * Retrieve project timesheet list columns.
 */
export function useProjectTimesheetColumns() {
  return React.useMemo(
    () => [
      {
        id: 'avatar',
        Header: '',
        Cell: AvatarCell,
        className: 'avatar',
        width: 45,
        disableResizing: true,
        disableSortBy: true,
        clickable: true,
      },
      {
        id: 'name',
        Header: 'Header',
        accessor: TimesheetAccessor,
        width: 100,
        className: 'name',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'duration',
        Header: '',
        accessor: 'duration',
        width: 120,
        className: 'duration',
        align: 'right',
        clickable: true,
        textOverview: true,
      },
    ],
    [],
  );
}
