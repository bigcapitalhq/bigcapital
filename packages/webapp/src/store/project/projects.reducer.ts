import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createTableStateReducers } from '@/store/table-state.reducer';
import { RESET } from '@/store/types';;
import type { TableQuery } from '@/store/store.types';

interface ProjectsState {
  tableState: Partial<TableQuery>;
}

export const defaultTableQuery: Partial<TableQuery> = {
  pageSize: 20,
  pageIndex: 0,
  filterRoles: [],
  viewSlug: null,
};

const initialState: ProjectsState = {
  tableState: defaultTableQuery,
};

const STORAGE_KEY = 'bigcapital:projects';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};
const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('PROJECTS', defaultTableQuery),

  [RESET]: (): void => {
    purgeStoredState(CONFIG);
  },
});

export const projectsPersistReducer = persistReducer(CONFIG, reducerInstance);
