import { createReducer} from '@reduxjs/toolkit';
import {
  createTableStateReducers,
} from 'store/tableState.reducer';

const initialState = {
  tableState: {
    
  },
};

export default createReducer(initialState, {
  ...createTableStateReducers('ACCOUNTS'),
});
