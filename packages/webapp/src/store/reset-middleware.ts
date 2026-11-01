import type { StoreEnhancer } from 'redux';

const ResetMiddleware: StoreEnhancer = (next) => (reducer, initialState) => {
  const resetType = 'RESET';
  const resetData = 'state';

  const enhanceReducer: typeof reducer = (state, action) => {
    if ((action as { type: string }).type === resetType) {
      state = (action as Record<string, unknown>)[resetData] as typeof state;
    }
    return reducer(state, action);
  };

  return next(enhanceReducer, initialState);
};

export default ResetMiddleware;
