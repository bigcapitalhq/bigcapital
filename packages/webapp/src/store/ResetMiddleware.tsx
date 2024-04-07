// @ts-nocheck
export default (next) => (reducer, initialState, enhancer) => {
  const resetType = 'RESET';
  const resetData = 'state';

  const enhanceReducer = (state, action) => {
    if (action.type === resetType) {
      state = action[resetData];
    }
    return reducer(state, action);
  };

  return next(enhanceReducer, initialState, enhancer);
};
