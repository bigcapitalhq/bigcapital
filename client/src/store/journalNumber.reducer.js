
export const journalNumberReducers = (type) => ({
  [type]: (state, action) => {
    const { isChanged } = action.payload;
    state.journalNumberChanged = isChanged;
  },
});