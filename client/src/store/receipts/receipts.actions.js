import t from 'store/types';

export const setReceiptsTableState = (queries) => {
  return {
    type: t.RECEIPTS_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const setSelectedRowsItems = () => {};
