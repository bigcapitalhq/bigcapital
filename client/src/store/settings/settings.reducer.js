import { createReducer } from '@reduxjs/toolkit';
import t from 'store/types';
import { optionsArrayToMap } from 'utils';
const initialState = {
  data: {
    organization: {},
  },
};

export default createReducer(initialState, {
  [t.SETTING_SET]: (state, action) => {
    const { options } = action;

    state.data.organization = optionsArrayToMap(options);
  },
});
