import {createReducer} from '@reduxjs/toolkit'
import t from 'store/types';

const initialState = {
  all: [],
  registered: [],
};

export default createReducer(initialState, {
  [t.CURRENCIES_REGISTERED_SET]: (state, action) => {
    state.registered = action.currencies;
  },

  [t.CURRENCIES_ALL_SET]: (state, action) => {
    state.all = action.currencies;
  },
});

