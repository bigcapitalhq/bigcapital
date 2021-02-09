import { createReducer } from '@reduxjs/toolkit';
import {
  createTableStateReducers,
} from 'store/tableState.reducer';

// Initial state.
const initialState = {
  tableState: {},
};

export default createReducer(initialState, {
  ...createTableStateReducers('ITEMS_CATEGORIES'),
});
