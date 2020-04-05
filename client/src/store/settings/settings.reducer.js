import { createReducer } from '@reduxjs/toolkit';
import t from 'store/types';

const initialState = {
  data: {
    organization: {
      name: 'Bigcapital, Limited Liabilities',
    },
  },
};

export default createReducer(initialState, {
  ['asdfas']: (state, action) => {
    
  },
});