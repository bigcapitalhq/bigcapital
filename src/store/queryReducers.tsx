// @ts-nocheck


export const createTableQueryReducers = 
  (resourceName = '', reducer) =>
  (state, action) => {
    const RESOURCE_NAME = resourceName.toUpperCase();

    switch (action.type) {
      case `${RESOURCE_NAME}/TABLE_QUERY_SET`:
        return {
          ...state,
          tableQuery: {
            ...state.tableQuery,
            [state.key]: state.value,
          }
        };
      case `${RESOURCE_NAME}/TABLE_QUERIES_ADD`:
        return {
          ...state,
          tableQuery: {
            ...state.tableQuery,
            ...action.payload.query,
          }
        };
      default:
        return reducer(state, action);
    }
}