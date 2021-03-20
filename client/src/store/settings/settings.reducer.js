import { camelCase } from 'lodash';
import { createReducer } from '@reduxjs/toolkit';
import t from 'store/types';

const initialState = {
  data: {
    organization: {
      name: 'Bigcapital, LLC',
    },
    manualJournals: {},
    bills: {},
    billPayments: {},
    salesEstimates: {},
  },
};

export default createReducer(initialState, {
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
});
