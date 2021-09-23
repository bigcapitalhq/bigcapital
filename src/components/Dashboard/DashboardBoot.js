import React from 'react';
import * as R from 'ramda';

import { useUser, useCurrentOrganization } from '../../hooks/query';
import { useSplashLoading } from '../../hooks/state';
import { useWatch, useWhen } from '../../hooks';

import withAuthentication from '../../containers/Authentication/withAuthentication';

import { setCookie, getCookie } from '../../utils';

/**
 * Dashboard async booting.
 */
function DashboardBootJSX({ authenticatedUserId }) {
  // Fetches the current user's organization.
  const {
    isSuccess: isCurrentOrganizationSuccess,
    isLoading: isOrgLoading,
    data: organization,
  } = useCurrentOrganization();

  // Authenticated user.
  const {
    isSuccess: isAuthUserSuccess,
    isLoading: isAuthUserLoading,
  } = useUser(authenticatedUserId);

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
  // applicaiton still not booted.
  useWatch(isOrgLoading, (value) => {
    value && !isBooted.current && startLoading();
  });

  // Splash loading when request authenticated user loading and 
  // application still not booted yet.
  useWatch(isAuthUserLoading, (value) => {
    value && !isBooted.current && startLoading();
  });  

  // Stop splash loading once organization request success.
  useWatch(isCurrentOrganizationSuccess, (value) => {
    value && stopLoading();
  });

  // Stop splash loading once authenticated user request success.
  useWatch(isAuthUserSuccess, (value) => {
    value && stopLoading();
  });

  // Once the all requests complete change the app loading state.
  useWhen(
    isAuthUserSuccess &&
      isCurrentOrganizationSuccess &&
      localeCookie === organization?.metadata?.language,
    () => {
      isBooted.current = true;
    },
  );
  return null;
}

export const DashboardBoot = R.compose(
  withAuthentication(({ authenticatedUserId }) => ({
    authenticatedUserId,
  })),
)(DashboardBootJSX);
