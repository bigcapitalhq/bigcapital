// @ts-nocheck
import t from '@/store/types';

export const setVendorCreditTableState = (queries) => {
  return {
    type: t.VENDOR_CREDITS_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetVendorCreditTableState = () => {
  return {
    type: t.VENDOR_CREDITS_NOTES_TABLE_STATE_RESET,
  };
};

export const setVendorCreditsSelectedRows = (selectedRows) => {
  return {
    type: 'VENDOR_CREDITS/SET_SELECTED_ROWS',
    payload: selectedRows,
  };
};
