import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  splashStopLoading,
  splashStartLoading,
  dashboardPageTitle,
} from '../../store/dashboard/dashboard.actions';

export const useDispatchAction = (action) => {
  const dispatch = useDispatch();

  return useCallback(
    (payload) => {
      dispatch(action(payload));
    },
    [dispatch, action],
  );
};

export const useDashboardPageTitle = () => {
  return useDispatchAction(dashboardPageTitle);
};

/**
 * Splash loading screen actions.
 */
export const useSplashLoading = () => {
  return [
    useDispatchAction(splashStartLoading),
    useDispatchAction(splashStopLoading),
  ];
};
