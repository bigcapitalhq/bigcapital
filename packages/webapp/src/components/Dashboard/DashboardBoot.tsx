// @ts-nocheck
import React from 'react';
import {
  useAuthenticatedAccount,
  useCurrentOrganization,
  useDashboardMeta,
} from '@/hooks/query';
import { useSplashLoading } from '@/hooks/state';
import { useWatch, useWatchImmediate, useWhen } from '@/hooks';
import { setCookie, getCookie } from '@/utils';

/**
 * Dashboard meta async booting.
 *  - Fetches the dashboard meta in booting state.
 *  - Once the dashboard meta query started loading display dashboard splash screen.
 */
export function useDashboardMetaBoot() {
  const {
    data: dashboardMeta,
    isLoading: isDashboardMetaLoading,
    isSuccess: isDashboardMetaSuccess,
  } = useDashboardMeta({
    keepPreviousData: true,
  });
  const [startLoading, stopLoading] = useSplashLoading();

  useWatchImmediate((value) => {
    value && startLoading();
  }, isDashboardMetaLoading);

  useWatchImmediate(() => {
    isDashboardMetaSuccess && stopLoading();
  }, isDashboardMetaSuccess);

  return {
    meta: dashboardMeta,
    isLoading: isDashboardMetaLoading,
    isSuccess: isDashboardMetaSuccess,
  };
}

/**
 * Application async booting.
 */
export function useApplicationBoot() {
  // Fetches the current user's organization.
  const {
    isSuccess: isCurrentOrganizationSuccess,
    isLoading: isOrgLoading,
    data: organization,
  } = useCurrentOrganization();

  // Authenticated user.
  const { isSuccess: isAuthUserSuccess, isLoading: isAuthUserLoading } =
    useAuthenticatedAccount();

  // Initial locale cookie value.
  const localeCookie = getCookie('locale');

  // Is the dashboard booted.
  const isBooted = React.useRef(false);

  // Syns the organization language with locale cookie.
  React.useEffect(() => {
    if (organization?.metadata?.language) {
      setCookie('locale', organization.metadata.language);
    }
  }, [organization]);

  React.useEffect(() => {
    // Can't continue if the organization metadata is not loaded yet.
    if (!organization?.metadata?.language) {
      return;
    }
    // Can't continue if the organization is already booted.
    if (isBooted.current) {
      return;
    }
    // Reboot the application in case the initial locale not equal
    // the current organization language.
    if (localeCookie !== organization.metadata.language) {
      window.location.reload();
    }
  }, [localeCookie, organization]);

  const [startLoading, stopLoading] = useSplashLoading();

  // Splash loading when organization request loading and
  // application still not booted.
  useWatchImmediate((value) => {
    value && !isBooted.current && startLoading();
  }, isOrgLoading);

  // Splash loading when request authenticated user loading and
  // application still not booted yet.
  useWatchImmediate((value) => {
    value && !isBooted.current && startLoading();
  }, isAuthUserLoading);

  // Stop splash loading once organization request success.
  useWatch((value) => {
    value && stopLoading();
  }, isCurrentOrganizationSuccess);

  // Stop splash loading once authenticated user request success.
  useWatch((value) => {
    value && stopLoading();
  }, isAuthUserSuccess);

  // Once the all requests complete change the app loading state.
  useWhen(
    isAuthUserSuccess &&
      isCurrentOrganizationSuccess &&
      localeCookie === organization?.metadata?.language,
    () => {
      isBooted.current = true;
    },
  );

  return {
    isLoading: isOrgLoading || isAuthUserLoading,
  };
}
