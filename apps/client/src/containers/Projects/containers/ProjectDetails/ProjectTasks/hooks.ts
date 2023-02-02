// @ts-nocheck
import React from 'react';
import { TaskAccessor, TaskTimeAccessor } from './components';

/**
 * Retrieve project tasks list columns.
 */
export function useProjectTaskColumns() {
  return React.useMemo(
    () => [
      {
        id: 'name',
        Header: 'Header',
        accessor: TaskAccessor,
        width: 100,
        className: 'name',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'actions',
        Header: 'Header',
        accessor: TaskTimeAccessor,
        width: 100,
        className: 'name',
        clickable: true,
        textOverview: true,
      }
    ],
    [],
  );
}
