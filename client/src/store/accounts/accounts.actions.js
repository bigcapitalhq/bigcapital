import t from 'store/types';

export const setAccountsTableState = (queries) => {
  return {
    type: t.ACCOUNTS_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const setSelectedRowsItems = () => {};
