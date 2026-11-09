import type { TableQuery } from '@/store/store.types';

export const journalNumberChangedReducer = (type: string) => ({
  [type]: (
    state: { journalNumberChanged: boolean },
    action: { payload: { isChanged: boolean } },
  ) => {
    state.journalNumberChanged = action.payload.isChanged;
  },
});

interface PaginationPayload {
  pagination: { page_size: string; page: string; total: string };
  customViewId: string | number;
}

interface PaginationMeta {
  pageSize: number;
  page: number;
  total: number;
  pagesCount: number;
  pageIndex: number;
}

interface ViewEntry {
  paginationMeta?: PaginationMeta;
}

export const viewPaginationSetReducer = (type: string) => ({
  [type]: (
    state: { views: Record<string | number, ViewEntry> },
    action: { payload: PaginationPayload },
  ) => {
    const { pagination, customViewId } = action.payload;
    const mapped = {
      pageSize: parseInt(pagination.page_size, 10),
      page: parseInt(pagination.page, 10),
      total: parseInt(pagination.total, 10),
    };
    const paginationMeta: PaginationMeta = {
      ...mapped,
      pagesCount: Math.ceil(mapped.total / mapped.pageSize),
      pageIndex: Math.max(mapped.page - 1, 0),
    };
    state.views = {
      ...state.views,
      [customViewId]: {
        ...(state.views?.[customViewId] ?? {}),
        paginationMeta,
      },
    };
  },
});

export const createTableQueryReducers = (RESOURCE_NAME: string) => ({
  [`${RESOURCE_NAME}/TABLE_QUERY_SET`]: (
    state: { tableQuery: Partial<TableQuery> },
    action: { payload: { value: unknown }; key: string },
  ) => {
    state.tableQuery = {
      ...state.tableQuery,
      [action.key]: action.payload.value,
    };
  },
  [`${RESOURCE_NAME}/TABLE_QUERIES_ADD`]: (
    state: { tableQuery: Partial<TableQuery> },
    action: { payload: { queries: Partial<TableQuery> } },
  ) => {
    state.tableQuery = { ...state.tableQuery, ...action.payload.queries };
  },
});
