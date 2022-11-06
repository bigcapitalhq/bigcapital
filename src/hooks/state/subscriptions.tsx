// @ts-nocheck
import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux";
import { setSubscriptions } from '@/store/subscription/subscription.actions';
import {
  isSubscriptionOnTrialFactory,
  isSubscriptionInactiveFactory,
  isSubscriptionActiveFactory,
} from '@/store/subscription/subscription.selectors';

/**
 * Sets subscriptions.
 */
export const useSetSubscriptions = () => {
  const dispatch = useDispatch();

  return useCallback((subscriptions) => {
    dispatch(setSubscriptions(subscriptions));
  }, [dispatch]);
}

/**
 * The organization subscription selector.
 * @param   {string} slug 
 * @returns {}
 */
export const useSubscription = (slug = 'main') => {
  const isSubscriptionOnTrial = useSelector(isSubscriptionOnTrialFactory(slug));
  const isSubscriptionInactive = useSelector(isSubscriptionInactiveFactory(slug));
  const isSubscriptionActive = useSelector(isSubscriptionActiveFactory(slug));

  return {
    isSubscriptionActive,
    isSubscriptionInactive,
    isSubscriptionOnTrial
  }
}