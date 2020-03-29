

export const createTableQueryReducers = 
  (resourceName = '', reducer) =>
  (state, action) => {
    const RESOURCE_NAME = resourceName.toUpperCase();

    switch (action.type) {
      case `${RESOURCE_NAME}_TABLE_QUERY_SET`:
        return {
          ...state,
          tableQuery: {
            ...state.tableQuery,
            [state.key]: state.value,
          }
        };
      case `${RESOURCE_NAME}_TABLE_QUERIES_ADD`:
        return {
          ...state,
          tableQuery: {
            ...state.tableQuery,
            ...action.queries
          },
        };
      default:
        return reducer(state, action);
    }  
}