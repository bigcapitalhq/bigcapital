import t from 'store/types';

export const setVendorsCreditNoteTableState = (queries) => {
  return {
    type: t.VENDORS_CREDIT_NOTE_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetVendorsCreditNoteTableState = () => {
  return {
    type: t.VENDORS_CREDIT_NOTE_TABLE_STATE_RESET,
  };
};
