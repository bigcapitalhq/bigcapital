import { ESTIMATES_TABLE_STATE_RESET, ESTIMATES_TABLE_STATE_SET, ESTIMATES_SET_SELECTED_ROWS } from '@/store/types';;
import type { TableQuery } from '@/store/store.types';

export const setEstimatesTableState = (queries: Partial<TableQuery>) => {
  return {
    type: ESTIMATES_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetEstimatesTableState = () => {
  return {
    type: ESTIMATES_TABLE_STATE_RESET,
  };
}

export const setEstimatesSelectedRows = (selectedRows: Array<unknown>) => {
  return {
    type: ESTIMATES_SET_SELECTED_ROWS,
    payload: selectedRows,
  };
};
