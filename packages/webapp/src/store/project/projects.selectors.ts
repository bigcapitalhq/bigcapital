import { isEqual } from 'lodash';
import { defaultTableQuery } from './projects.reducer';
import type { RootState } from '@/store/reducers';
import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';

const projectsTableState = (state: RootState) => state.projects.tableState;

// Retrieve projects table query.
export const getProjectsTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    projectsTableState,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );

export const isProjectsTableStateChangedFactory = () =>
  createDeepEqualSelector(projectsTableState, (tableState) => {
    return !isEqual(tableState, defaultTableQuery);
  });
