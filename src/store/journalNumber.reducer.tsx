// @ts-nocheck

export const journalNumberChangedReducer = (type) => ({
  [type]: (state, action) => {
    const { isChanged } = action.payload;
    state.journalNumberChanged = isChanged;
  },
});

export const viewPaginationSetReducer = (type) => ({
  [type]: (state, action) => {
    const { pagination, customViewId } = action.payload;

    const mapped = {
      pageSize: parseInt(pagination.page_size, 10),
      page: parseInt(pagination.page, 10),
      total: parseInt(pagination.total, 10),
    };
    const paginationMeta = {
      ...mapped,
      pagesCount: Math.ceil(mapped.total / mapped.pageSize),
      pageIndex: Math.max(mapped.page - 1, 0),
    };
    state.views = {
      ...state.views,
      [customViewId]: {
        ...(state.views?.[customViewId] || {}),
        paginationMeta,
      },
    };
  },
});

export const createTableQueryReducers = (RESOURCE_NAME) => ({
  [`${RESOURCE_NAME}/TABLE_QUERY_SET`]: (state, action) => {
    state.tableQuery = {
      ...state.tableQuery,
      [state.key]: action.payload.value,
    };
  },

  [`${RESOURCE_NAME}/TABLE_QUERIES_ADD`]: (state, action) => {
    state.tableQuery = {
      ...state.tableQuery,
      ...action.payload.queries,
    };
  },
});