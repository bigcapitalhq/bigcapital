// @ts-nocheck
import { createReducer } from '@reduxjs/toolkit';
import t from '@/store/types';

const initialState = {
  data: {},
};

export default createReducer(initialState, {

  [t.SET_PLAN_SUBSCRIPTIONS_LIST]: (state, action) => {
    const { subscriptions } = action.payload;
    const _data = {};

    subscriptions.forEach((subscription) => {
      _data[subscription.id] = subscription;
    });
    state.data = _data;
  },
});
