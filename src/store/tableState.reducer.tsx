// @ts-nocheck

const TYPES = {
  TABLE_STATE_SET: 'TABLE_STATE_SET',
  TABLE_STATE_RESET: 'TABLE_STATE_RESET'
};

export const createTableStateReducers = (RESOURCE_NAME, defaultTableQuery) => ({
  /**
   * Resource table state set.
   */
  [`${RESOURCE_NAME}/${TYPES.TABLE_STATE_SET}`]: (state, action) => {
    const { queries } = action.payload;

    state.tableState = {
      ...state.tableState,
      ...queries,
    };
  },

  [`${RESOURCE_NAME}/${TYPES.TABLE_STATE_RESET}`]: (state, action) => {
    state.tableState = {
      ...defaultTableQuery,
    };
  }
});
