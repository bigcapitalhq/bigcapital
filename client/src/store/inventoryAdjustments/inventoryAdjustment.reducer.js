import { createReducer } from '@reduxjs/toolkit';
import {
  createTableStateReducers,
} from 'store/tableState.reducer';

const initialState = {
  tableState: {
    pageSize: 12,
    pageIndex: 0,
    sortBy: [],
  },
  selectedRows: [],
};

export default createReducer(initialState, {
  ...createTableStateReducers('INVENTORY_ADJUSTMENTS'), 
});
