
export const journalNumberChangedReducer = (type) => ({
  [type]: (state, action) => {
    const { isChanged } = action.payload;
    state.journalNumberChanged = isChanged;
  },
});