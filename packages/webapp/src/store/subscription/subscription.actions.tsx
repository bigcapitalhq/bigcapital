// @ts-nocheck
import ApiService from '@/services/ApiService';
import t from '@/store/types';

export const fetchSubscriptions = () => (dispatch) => new Promise((resolve, reject) => {
  ApiService.get('subscription').then((response) => {
    dispatch({
      type: t.SET_PLAN_SUBSCRIPTIONS_LIST,
      payload: {
        subscriptions: response.data.subscriptions,
      },
    });
    resolve(response);
  }).catch((error) => { reject(error); })
});


export const setSubscriptions = (subscriptions) => {
  return {
    type: t.SET_PLAN_SUBSCRIPTIONS_LIST,
    payload: {
      subscriptions,
    },
  }
};

