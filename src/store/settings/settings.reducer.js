import { camelCase } from 'lodash';
import { createReducer } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, purgeStoredState } from 'redux-persist';

import t from 'store/types';

const initialState = {
  data: {
    organization: {
      name: 'Bigcapital, LLC',
    },
    manualJournals: {
      tableSize: 'medium',
    },
    bills: {
      tableSize: 'medium',
    },
    billPayments: {
      tableSize: 'medium',
    },
    paymentReceives: {
      tableSize: 'medium',
    },
    salesEstimates: {
      tableSize: 'medium',
    },
    items: {
      tableSize: 'medium',
    },
    salesInvoices: {
      tableSize: 'medium',
    },
    salesReceipts: {
      tableSize: 'medium',
    },
    expenses: {
      tableSize: 'medium',
    },
    customers: {
      tableSize: 'medium',
    },
    vendors: {
      tableSize: 'medium',
    },
    accounts: {
      tableSize: 'medium',
    },
    cashflowAccounts: {
      tableSize: 'medium',
    },
    cashflowTransactions: {
      tableSize: 'medium',
    },
    creditNote: {
      tableSize: 'medium',
    },
    vendorCredit: {
      tableSize: 'medium',
    },
    warehouseTransfer: {
      tableSize: 'medium',
    },
    projects: {
      tableSize: 'medium',
    },
    timesheets: {
      tableSize: 'medium',
    },
  },
};

const STORAGE_KEY = 'bigcapital:settings';

const PRESIST_CONFIG = {
  key: STORAGE_KEY,
  whitelist: ['data'],
  storage,
};

const reducerInstance = createReducer(initialState, {
  [t.SETTING_SET]: (state, action) => {
    const { options } = action;
    const _data = {
      ...state.data,
    };
    options.forEach((option) => {
      const { key, group, value } = option;
      const _group = camelCase(group);
      const _key = camelCase(key);

      if (!_data[_group]) {
        _data[_group] = {};
      }
      _data[_group][_key] = value;
    });
    state.data = _data;
  },

  [t.SETTING_ADD]: (state, action) => {
    const { group, key, value } = action.payload;

    const newData = {
      ...state.data,
      [group]: {
        ...state.data[group],
        [key]: value,
      },
    };
    state.data = newData;
  },
});

export default persistReducer(PRESIST_CONFIG, reducerInstance);
