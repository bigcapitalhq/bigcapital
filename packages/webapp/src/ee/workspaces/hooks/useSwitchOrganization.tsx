// @ts-nocheck
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useQueryClient } from 'react-query';
import { setCookie } from '@/utils';
import { setOrganizationId } from '@/store/authentication/authentication.actions';

/**
 * Switches the active organization by updating the cookie,
 * Redux state, clearing the query cache, and reloading the app.
 */
export function useSwitchOrganization() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useCallback(
    (organizationId: string, workspaceName?: string) => {
      // Store workspace name for toast message after reload
      if (workspaceName) {
        sessionStorage.setItem('switchedWorkspaceName', workspaceName);
      }
      setCookie('organization_id', organizationId);
      dispatch(setOrganizationId(organizationId));
      queryClient.removeQueries();
      window.location.assign('/');
    },
    [dispatch, queryClient],
  );
}
