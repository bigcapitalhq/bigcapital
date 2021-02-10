import t from 'store/types';

export const setVendorsTableState = (queries) => {
  return {
    type: t.VENDORS_TABLE_STATE_SET,
    payload: { queries },
  };
}