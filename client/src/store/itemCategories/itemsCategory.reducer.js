import { createReducer } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  createTableStateReducers,
} from 'store/tableState.reducer';

// Initial state.
const initialState = {
  tableState: {},
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('ITEMS_CATEGORIES'),
});


const STORAGE_KEY = 'bigcapital:itemCategories';

export default persistReducer(
  {
    key: STORAGE_KEY,
    whitelist: ['tableState'],
    storage,
  },
  reducerInstance,
);
