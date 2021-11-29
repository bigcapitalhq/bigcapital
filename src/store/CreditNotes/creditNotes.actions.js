import t from 'store/types';

export const setCreditNotesTableState = (queries) => {
  return {
    type: t.CREDIT_NOTE_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetCreditNotesTableState = () => {
  return {
    type: t.CREDIT_NOTE_TABLE_STATE_RESET,
  };
};
