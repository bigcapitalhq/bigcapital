import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { dashboardPageTitle } from 'store/dashboard/dashboard.actions';

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

export const useSetAccountsTableQuery = () => {

};

export const useAccountsTableQuery = () => {
  
}

