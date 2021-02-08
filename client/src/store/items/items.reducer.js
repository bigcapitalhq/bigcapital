import { createReducer } from '@reduxjs/toolkit';
import {
  createTableQueryReducers,
} from 'store/journalNumber.reducer';

const initialState = {
  tableQuery: {
    pageSize: 12,
    page: 1,
  },
  selectedRows: [],
};

export default createReducer(initialState, {
  ...createTableQueryReducers('ITEMS'),
});