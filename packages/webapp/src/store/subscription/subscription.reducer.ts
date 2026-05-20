import { createReducer } from '@reduxjs/toolkit';
import { SET_PLAN_SUBSCRIPTIONS_LIST } from '@/store/types';;

interface SubscriptionsState {
  data: Record<string, unknown>;
}

const initialState: SubscriptionsState = {
  data: {},
};

export const subscriptionsReducer = createReducer(initialState, {
  [SET_PLAN_SUBSCRIPTIONS_LIST]: (
    state,
    action: { payload: { subscriptions: Array<Record<string, unknown>> } },
  ) => {
    const { subscriptions } = action.payload;
    const _data: Record<string, unknown> = {};

    subscriptions.forEach((subscription) => {
      _data[subscription.id as string] = subscription;
    });
    state.data = _data;
  },
});
