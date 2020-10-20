import { createReducer } from '@reduxjs/toolkit';
import t from 'store/types';
import { optionsArrayToMap } from 'utils';
const initialState = {
  data: {
    organization: {
      name: 'Bigcapital, Limited Liabilities',
    },
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
      if (!_data[group]) {
        _data[group] = {};
      }
      _data[group][key] = value;
    });
    state.data = _data;
  },
});
