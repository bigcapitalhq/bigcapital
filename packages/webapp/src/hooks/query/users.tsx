// @ts-nocheck
import { useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import useApiRequest from '../useRequest';
import { useSetFeatureDashboardMeta } from '../state/feature';
import t from './types';
import { useSetAuthEmailConfirmed } from '../state';

// Common invalidate queries.
const commonInvalidateQueries = (queryClient) => {
  queryClient.invalidateQueries(t.USERS);
};

/**
 * Create a new invite user.
 */
export function useCreateInviteUser(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('invite/send', values), {
    onSuccess: () => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Edits the given user.
 */
export function useEditUser(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(([id, values]) => apiRequest.post(`users/${id}`, values), {
    onSuccess: (res, [id, values]) => {
      queryClient.invalidateQueries([t.USER, id]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

export function useInactivateUser(props) {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation((userId) => apiRequest.put(`users/${userId}/inactivate`), {
    onSuccess: (res, userId) => {
      queryClient.invalidateQueries([t.USER, userId]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

export function useActivateUser(props) {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation((userId) => apiRequest.put(`users/${userId}/activate`), {
    onSuccess: (res, userId) => {
      queryClient.invalidateQueries([t.USER, userId]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Deletes the given user.
 */
export function useDeleteUser(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`users/${id}`), {
    onSuccess: (res, id) => {
      queryClient.invalidateQueries([t.USER, id]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Retrieves users list.
 */
export function useUsers(props) {
  return useRequestQuery(
    [t.USERS],
    {
      method: 'get',
      url: 'users',
    },
    {
      select: (res) => res.data.users,
      defaultData: [],
      ...props,
    },
  );
}

/**
 * Retrieve details of the given user.
 */
export function useUser(id, props) {
  return useRequestQuery(
    [t.USER, id],
    {
      method: 'get',
      url: `users/${id}`,
    },
    {
      select: (response) => response.data.user,
      defaultData: {},
      ...props,
    },
  );
}

export function useAuthenticatedAccount(props) {
  const setEmailConfirmed = useSetAuthEmailConfirmed();

  return useRequestQuery(
    ['AuthenticatedAccount'],
    {
      method: 'get',
      url: `account`,
    },
    {
      select: (response) => response.data.data,
      defaultData: {},
      onSuccess: (data) => {
        setEmailConfirmed(data.is_verified, data.email);
      },
      ...props,
    },
  );
}

/**
 * Fetches the dashboard meta.
 */
export const useDashboardMeta = (props) => {
  const setFeatureDashboardMeta = useSetFeatureDashboardMeta();

  const state = useRequestQuery(
    [t.DASHBOARD_META],
    { method: 'get', url: 'dashboard/boot' },
    {
      select: (res) => res.data.meta,
      defaultData: {},
      ...props,
    },
  );
  useEffect(() => {
    if (state.isSuccess) {
      setFeatureDashboardMeta(state.data);
    }
  }, [state.isSuccess, state.data, setFeatureDashboardMeta]);
  return state;
};
