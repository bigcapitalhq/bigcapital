// @ts-nocheck
import { camelCase } from 'lodash';
import { createReducer } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, purgeStoredState } from 'redux-persist';

import t from '@/store/types';

const initialState = {
  data: {
    organization: {
      name: 'Bigcapital, LLC',
    },
    manualJournals: {
      tableSize: 'small',
    },
    bills: {
      tableSize: 'small',
    },
    billPayments: {
      tableSize: 'small',
    },
    paymentReceives: {
      tableSize: 'small',
    },
    salesEstimates: {
      tableSize: 'small',
    },
    items: {
      tableSize: 'small',
    },
    salesInvoices: {
      tableSize: 'small',
    },
    salesReceipts: {
      tableSize: 'small',
    },
    expenses: {
      tableSize: 'small',
    },
    customers: {
      tableSize: 'small',
    },
    vendors: {
      tableSize: 'small',
    },
    accounts: {
      tableSize: 'small',
    },
    cashflowAccounts: {
      tableSize: 'small',
    },
    cashflowTransactions: {
      tableSize: 'small',
    },
    creditNote: {
      tableSize: 'small',
    },
    vendorCredit: {
      tableSize: 'small',
    },
    warehouseTransfer: {
      tableSize: 'small',
    },
    projectTasks: {
      tableSize: 'small',
    },
    projectTasks: {
      tableSize: 'medium',
    },
  },
};

const STORAGE_KEY = 'bigcapital:settings';

const PERSIST_CONFIG = {
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

export default persistReducer(PERSIST_CONFIG, reducerInstance);
