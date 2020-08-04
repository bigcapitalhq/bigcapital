import { createReducer } from '@reduxjs/toolkit';
import { createTableQueryReducers } from 'store/queryReducers';

import t from 'store/types';

const initialState = {
  items: {},
  views: {},
  loading: false,
  tableQuery: {
    page_size: 12,
    page: 1,
  },
  currentViewId: -1,
};

const defaultInvoice = {
  entires: [],
};




const reducer = createReducer(initialState, {
[t.INVOICE_SET]:(state,actio)=>{

  const {id,INVOICE_SET} = action.payload;

}


});
