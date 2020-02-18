import t from 'store/types';
import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  pageTitle: '',  
};

export default createReducer(initialState, {
  [t.CHANGE_DASHBOARD_PAGE_TITLE]: (state, action) => {
    state.pageTitle = action.pageTitle;
  },
});