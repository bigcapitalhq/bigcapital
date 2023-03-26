// @ts-nocheck
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { isAuthenticated } from '@/store/authentication/authentication.reducer';
import { setLogin } from '@/store/authentication/authentication.actions';
import { useQueryClient } from 'react-query';
import { removeCookie } from '@/utils';

/**
 * Removes the authentication cookies.
 */
function removeAuthenticationCookies() {
  removeCookie('token');
  removeCookie('organization_id');
  removeCookie('tenant_id');
  removeCookie('authenticated_user_id');
  removeCookie('locale');
}

export const useAuthActions = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return {
    setLogin: useCallback((login) => dispatch(setLogin(login)), [dispatch]),
    setLogout: useCallback(() => {
      // Resets store state.
      // dispatch(setStoreReset());

      // Remove all cached queries.
      queryClient.removeQueries();

      removeAuthenticationCookies();

      window.location.reload();
    }, [queryClient]),
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
  return useSelector((state) => ({}));
};

/**
 * Retrieve the authenticated organization id.
 */
export const useAuthOrganizationId = () => {
  return useSelector((state) => state.authentication.organizationId);
};
