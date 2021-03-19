import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { isAuthenticated } from 'store/authentication/authentication.reducer';
import {
  setLogin,
  setLogout,
  setStoreReset,
} from 'store/authentication/authentication.actions';
import { purgePersistedState } from 'store/createStore';
import { useQueryClient } from 'react-query';

export const useAuthActions = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return {
    setLogin: useCallback((login) => dispatch(setLogin(login)), [dispatch]),
    setLogout: useCallback(() => {
      // Resets store state.
      dispatch(setStoreReset());

      // Remove all cached queries.
      queryClient.removeQueries();
    }, [dispatch, queryClient]),
  };
};

/**
 * Retrieve whether the user is authenticated.
 */
export const useIsAuthenticated = () => {
  return useSelector(isAuthenticated);
};

/**
 * Retrieve the authentication token.
 */
export const useAuthToken = () => {
  return useSelector((state) => state.authentication.token);
};

/**
 * Retrieve the authentication user.
 */
export const useAuthUser = () => {
  return useSelector((state) => state.authentication.user);
};

/**
 * Retrieve the authenticated organization id.
 */
export const useAuthOrganizationId = () => {
  return useSelector((state) => state.authentication.organization);
};
