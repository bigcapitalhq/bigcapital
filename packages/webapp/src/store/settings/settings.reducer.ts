import { camelCase } from 'lodash';
import { createReducer } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import { SETTING_ADD, SETTING_SET } from '@/store/types';;
import type { SettingAction } from './settings.type';

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
  [SETTING_SET]: (state, action: SettingAction) => {
    const { options } = action;
    const _data: Record<string, Record<string, unknown>> = {
      ...(state.data as Record<string, Record<string, unknown>>),
    };
    (options ?? []).forEach((option) => {
      const { key, group, value } = option;
      const _group = camelCase(group);
      const _key = camelCase(key);

      if (!_data[_group]) {
        _data[_group] = {};
      }
      _data[_group][_key] = value;
    });
    state.data = _data as typeof state.data;
  },

  [SETTING_ADD]: (state, action: SettingAction) => {
    const { group, key, value } = action.payload!;
    const groupKey = group as keyof typeof state.data;

    const newData = {
      ...state.data,
      [group]: {
        ...((state.data[groupKey] as Record<string, unknown>) ?? {}),
        [key]: value,
      },
    };
    state.data = newData;
  },
});

export const settingsPersistReducer = persistReducer(PRESIST_CONFIG, reducerInstance);
