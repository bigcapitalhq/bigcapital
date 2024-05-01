// @ts-nocheck
import { useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import useApiRequest from '../useRequest';
import { useSetSubscriptions } from '../state/subscriptions';
import T from './types';

/**
 * Subscription payment via voucher.
 */
export const usePaymentByVoucher = (props) => {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation(
    (values) => apiRequest.post('subscription/license/payment', values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(T.SUBSCRIPTIONS);
        queryClient.invalidateQueries(T.ORGANIZATION_CURRENT);
        queryClient.invalidateQueries(T.ORGANIZATIONS);
      },
      ...props,
    },
  );
};

/**
 * Fetches the organization subscriptions.
 */
export const useOrganizationSubscriptions = (props) => {
  const setSubscriptions = useSetSubscriptions();

  const state = useRequestQuery(
    [T.SUBSCRIPTIONS],
    { method: 'get', url: 'subscriptions' },
    { ...props },
  );
  useEffect(() => {
    if (state.isSuccess) {
      setSubscriptions(state.data);
    }
  }, [state.isSuccess, state.data, setSubscriptions]);
};

/**
 * Fetches the checkout url of the Lemon Squeezy.
 */
export const useGetLemonSqueezyCheckout = (props = {}) => {
  const apiRequest = useApiRequest();

  return useMutation(
    (values) =>
      apiRequest
        .post('subscription/lemon/checkout_url', values)
        .then((res) => res.data),
    {
      ...props,
    },
  );
};
