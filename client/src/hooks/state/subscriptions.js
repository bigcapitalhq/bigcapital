import { useCallback } from "react"
import { useDispatch } from "react-redux";
import { setSubscriptions } from 'store/subscription/subscription.actions';

/**
 * Sets subscriptions.
 */
export const useSetSubscriptions = () => {
  const dispatch = useDispatch();

  return useCallback((subscriptions) => {
    dispatch(setSubscriptions(subscriptions));
  }, [dispatch]);
}
