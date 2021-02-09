
const TYPES = {
  TABLE_STATE_SET: 'TABLE_STATE_SET',
};

export const createTableStateReducers = (RESOURCE_NAME) => ({
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
});
