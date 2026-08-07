import type { TableQuery } from '@/store/store.types';
import {
  MANUAL_JOURNALS_TABLE_STATE_SET,
  MANUAL_JOURNALS_SET_SELECTED_ROWS,
} from '@/store/types';

export const setManualJournalsTableState = (queries: Partial<TableQuery>) => {
  return {
    type: MANUAL_JOURNALS_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const setManualJournalsSelectedRows = (selectedRows: Array<unknown>) => {
  return {
    type: MANUAL_JOURNALS_SET_SELECTED_ROWS,
    payload: selectedRows,
  };
};
