import type { TableQuery } from './store.types';

const TYPES = {
  TABLE_STATE_SET: 'TABLE_STATE_SET',
  TABLE_STATE_RESET: 'TABLE_STATE_RESET',
};

export const createTableStateReducers = (
  RESOURCE_NAME: string,
  defaultTableQuery: Partial<TableQuery> = {},
) => ({
  [`${RESOURCE_NAME}/${TYPES.TABLE_STATE_SET}`]: (
    state: { tableState: Partial<TableQuery> },
    action: { payload: { queries: Partial<TableQuery> } },
  ) => {
    const { queries } = action.payload;
    state.tableState = { ...state.tableState, ...queries };
  },

  [`${RESOURCE_NAME}/${TYPES.TABLE_STATE_RESET}`]: (state: {
    tableState: Partial<TableQuery>;
  }) => {
    state.tableState = { ...defaultTableQuery };
  },
});
