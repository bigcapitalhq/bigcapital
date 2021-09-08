import React from 'react';
import * as R from 'ramda';

import { useUser, useCurrentOrganization } from 'hooks/query';
import withAuthentication from '../../containers/Authentication/withAuthentication';
import withDashboardActions from '../../containers/Dashboard/withDashboardActions';

import { setCookie, getCookie } from '../../utils';

/**
 * Dashboard async booting.
 */
function DashboardBootJSX({ setAppIsLoading, authenticatedUserId }) {
  // Fetches the current user's organization.
  const { isSuccess: isCurrentOrganizationSuccess, data: organization } =
    useCurrentOrganization();

  // Authenticated user.
  const { isSuccess: isAuthUserSuccess, data: authUser } =
    useUser(authenticatedUserId);

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

  React.useEffect(() => {
    // Once the all requests complete change the app loading state.
    if (
      isAuthUserSuccess &&
      isCurrentOrganizationSuccess &&
      localeCookie === organization?.metadata?.language
    ) {
      setAppIsLoading(false);
      isBooted.current = true;
    }
  }, [
    isAuthUserSuccess,
    isCurrentOrganizationSuccess,
    organization,
    setAppIsLoading,
    localeCookie,
  ]);
  return null;
}

export const DashboardBoot = R.compose(
  withAuthentication(({ authenticatedUserId }) => ({
    authenticatedUserId,
  })),
  withDashboardActions,
)(DashboardBootJSX);
