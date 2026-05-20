import { SET_PLAN_SUBSCRIPTIONS_LIST } from '@/store/types';;

export const setSubscriptions = (subscriptions: Array<Record<string, unknown>>) => {
  return {
    type: SET_PLAN_SUBSCRIPTIONS_LIST,
    payload: {
      subscriptions,
    },
  };
};