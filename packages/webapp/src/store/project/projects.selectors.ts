import { isEqual } from 'lodash';
import { createDeepEqualSelector } from '@/utils';
import { paginationLocationQuery } from '@/store/selectors';
import { defaultTableQuery } from './projects.reducer';
import type { RootState } from '@/store/reducers';

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
