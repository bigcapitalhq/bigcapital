import type { TableQuery } from '@/store/store.types';
import {
  VENDOR_CREDITS_NOTES_TABLE_STATE_RESET,
  VENDOR_CREDITS_TABLE_STATE_SET,
  VENDOR_CREDITS_SET_SELECTED_ROWS,
} from '@/store/types';

export const setVendorCreditTableState = (queries: Partial<TableQuery>) => {
  return {
    type: VENDOR_CREDITS_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetVendorCreditTableState = () => {
  return {
    type: VENDOR_CREDITS_NOTES_TABLE_STATE_RESET,
  };
};

export const setVendorCreditsSelectedRows = (selectedRows: Array<unknown>) => {
  return {
    type: VENDOR_CREDITS_SET_SELECTED_ROWS,
    payload: selectedRows,
  };
};
