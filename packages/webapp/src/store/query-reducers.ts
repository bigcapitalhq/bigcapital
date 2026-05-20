import type { Reducer, AnyAction } from 'redux';
import type { TableQuery } from './store.types';

interface TableQueryState {
  tableQuery: Partial<TableQuery>;
  key?: string;
  value?: unknown;
}

export const createTableQueryReducers =
  <S extends TableQueryState>(
    resourceName = '',
    reducer: Reducer<S, AnyAction>,
  ): Reducer<S, AnyAction> =>
  (state, action) => {
    const RESOURCE_NAME = resourceName.toUpperCase();

    switch (action.type) {
      case `${RESOURCE_NAME}/TABLE_QUERY_SET`:
        return {
          ...(state as S),
          tableQuery: {
            ...(state as S).tableQuery,
            [(state as S).key as string]: (state as S).value,
          },
        };
      case `${RESOURCE_NAME}/TABLE_QUERIES_ADD`:
        return {
          ...(state as S),
          tableQuery: {
            ...(state as S).tableQuery,
            ...action.payload?.query,
          },
        };
      default:
        return reducer(state, action);
    }
  };
