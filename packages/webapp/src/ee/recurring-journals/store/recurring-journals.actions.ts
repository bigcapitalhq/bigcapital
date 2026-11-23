import type { TableQuery } from '@/store/store.types';
import {
  RECURRING_JOURNALS_RESET_SELECTED_ROWS,
  RECURRING_JOURNALS_SET_SELECTED_ROWS,
  RECURRING_JOURNALS_TABLE_STATE_RESET,
  RECURRING_JOURNALS_TABLE_STATE_SET,
} from '@/store/types';

export const setRecurringJournalsTableState = (
  queries: Partial<TableQuery>,
) => ({
  type: RECURRING_JOURNALS_TABLE_STATE_SET,
  payload: { queries },
});

export const resetRecurringJournalsTableState = () => ({
  type: RECURRING_JOURNALS_TABLE_STATE_RESET,
});

export const setRecurringJournalsSelectedRows = (
  selectedRows: Array<unknown>,
) => ({
  type: RECURRING_JOURNALS_SET_SELECTED_ROWS,
  payload: selectedRows,
});

export const resetRecurringJournalsSelectedRows = () => ({
  type: RECURRING_JOURNALS_RESET_SELECTED_ROWS,
});
