import { createReducer } from '@reduxjs/toolkit';
import {
  createTableStateReducers,
} from 'store/tableState.reducer';

const initialState = {
  tableState: {
    pageSize: 12,
    pageIndex: 1,
    sortBy: [],
  },
};
 
export default createReducer(initialState, {
  ...createTableStateReducers('PAYMENT_MADES'),
});
