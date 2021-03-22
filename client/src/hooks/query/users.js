import { useMutation, useQueryClient } from 'react-query';
import { useQueryTenant, useRequestQuery } from '../useQueryRequest';
import useApiRequest from '../useRequest';
import t from './types';

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

  return useMutation(
    ([id, values]) => apiRequest.post(`users/${id}/inactivate`, values),
    {
      onSuccess: (res, [id, values]) => {
        queryClient.invalidateQueries([t.USER, id]);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
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
  const apiRequest = useApiRequest();

  return useQueryTenant(
    ['USER', id],
    () => apiRequest.get(`users/${id}`).then((response) => response.data.item),
    props,
  );
}
