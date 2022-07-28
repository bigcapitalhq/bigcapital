import React from 'react';
import { TaskAccessor } from './components';

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
    ],
    [],
  );
}
