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
        width: 150,
        className: 'duration',
        align: 'right',
        clickable: true,
        textOverview: true,
      },
    ],
    [],
  );
}
