import type { TableQuery } from '@/store/store.types';
import {
  PROJECTS_TABLE_STATE_RESET,
  PROJECTS_TABLE_STATE_SET,
} from '@/store/types';

export const setProjectsTableState = (queries: Partial<TableQuery>) => {
  return {
    type: PROJECTS_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetProjectsTableState = () => {
  return {
    type: PROJECTS_TABLE_STATE_RESET,
  };
};
