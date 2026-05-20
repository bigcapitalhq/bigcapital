import { CREDIT_NOTES_TABLE_STATE_RESET, CREDIT_NOTES_TABLE_STATE_SET, CREDIT_NOTES_SET_SELECTED_ROWS } from '@/store/types';;
import type { TableQuery } from '@/store/store.types';

export const setCreditNoteTableState = (queries: Partial<TableQuery>) => {
  return {
    type: CREDIT_NOTES_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetCreditNoteTableState = () => {
  return {
    type: CREDIT_NOTES_TABLE_STATE_RESET,
  };
};

export const setCreditNotesSelectedRows = (selectedRows: Array<unknown>) => {
  return {
    type: CREDIT_NOTES_SET_SELECTED_ROWS,
    payload: selectedRows,
  };
};
