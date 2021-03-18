import { createReducer } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createTableStateReducers } from 'store/tableState.reducer';

const initialState = {
  tableState: {
    pageSize: 12,
    pageIndex: 0,
  },
};

const STORAGE_KEY = 'bigcapital:bills';

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('BILLS'),
});

export default persistReducer(
  {
    key: STORAGE_KEY,
    whitelist: ['tableState'],
    storage,
  },
  reducerInstance,
);