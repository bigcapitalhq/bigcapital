// @ts-nocheck
import t from '@/store/types';

export const setCreditNoteTableState = (queries) => {
  return {
    type: t.CREDIT_NOTES_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetCreditNoteTableState = () => {
  return {
    type: t.CREDIT_NOTES_TABLE_STATE_RESET,
  };
};

export const setSelectedRowsItems = () => {};
