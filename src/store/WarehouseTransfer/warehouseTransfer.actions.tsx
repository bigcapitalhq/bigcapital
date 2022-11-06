// @ts-nocheck
import t from '@/store/types';

export const setWarehouseTransferTableState = (queries) => {
  return {
    type: t.WAREHOUSE_TRANSFERS_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetWarehouseTransferTableState = () => {
  return {
    type: t.WAREHOUSE_TRANSFERS_TABLE_STATE_RESET,
  };
};
