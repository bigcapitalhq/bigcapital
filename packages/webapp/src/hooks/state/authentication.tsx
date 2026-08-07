import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import {
  setAuthToken,
  setAuthUserId,
  setEmailConfirmed,
  setLogin,
  setOrganizationId,
  setLocale,
} from '@/store/authentication/authentication.actions';
import { isAuthenticated } from '@/store/authentication/authentication.reducer';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
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
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return {
    setLogin: useCallback(
      (_login: unknown) => dispatch(setLogin()),
      [dispatch],
    ),
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
  return useAppSelector(isAuthenticated);
};

/**
 * Retrieve the authentication token.
 */
export const useAuthToken = () => {
  return useAppSelector((state) => state.authentication.token);
};

/**
 * Retrieve the authentication user.
 */
export const useAuthUser = () => {
  return useAppSelector(() => ({}));
};

/**
 * Retrieve the authenticated organization id.
 */
export const useAuthOrganizationId = () => {
  return useAppSelector((state) => state.authentication.organizationId);
};

/**
 * Retrieves the user's email verification status.
 */
export const useAuthUserVerified = () => {
  return useAppSelector((state) => state.authentication.verified);
};

/**
 * Retrieves the user's email address.
 * @returns {string}
 */
export const useAuthUserVerifyEmail = () => {
  return useAppSelector((state) => state.authentication.verifyEmail);
};

/**
 * Sets the user's email verification status.
 */
export const useSetAuthEmailConfirmed = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (verified: boolean | undefined, email: string) =>
      dispatch(setEmailConfirmed(verified, email)),
    [dispatch],
  );
};

export const useSetOrganizationId = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (organizationId: string) => dispatch(setOrganizationId(organizationId)),
    [dispatch],
  );
};

export const useSetAuthToken = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (authToken: string) => dispatch(setAuthToken(authToken)),
    [dispatch],
  );
};

export const useSetAuthUserId = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (userId: string) => dispatch(setAuthUserId(userId)),
    [dispatch],
  );
};

export const useSetLocale = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (locale: string) => dispatch(setLocale(locale)),
    [dispatch],
  );
};
