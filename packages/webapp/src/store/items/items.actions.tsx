// @ts-nocheck
import t from '@/store/types';

export const setItemsTableState = (queries) => {
  return {
    type: t.ITEMS_TABLE_STATE_SET,
    payload: { queries },
  };
};


export const resetItemsTableState = () => {
  return {
    type: t.ITEMS_TABLE_STATE_RESET,
  };
}

export const setItemsSelectedRows = (selectedRows) => {
  return {
    type: 'ITEMS/SET_SELECTED_ROWS',
    payload: selectedRows,
  };
};
