import { useMutation, useQueryClient, useQuery } from 'react-query';
import { defaultTo } from 'lodash';
import useApiRequest from '../useRequest';


/**
 * Create a new invite user.
 */
export function useCreateInviteUser(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('invite/send', values), {
    onSuccess: () => {
      queryClient.invalidateQueries('USERS');
    },
    ...props,
  });
}

/**
 * Edits the given user.
 *
 */
export function useEditUser(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(([id, values]) => apiRequest.post(`users/${id}`, values), {
    onSuccess: () => {
      queryClient.invalidateQueries('USERS');
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
    onSuccess: () => {
      queryClient.invalidateQueries('USERS');
      queryClient.invalidateQueries('USER');
    },
    ...props,
  });
}

/**
 * Retrieves users list.
 */
export function useUsers(props) {
  const apiRequest = useApiRequest();

  const result = useQuery(
    ['USERS'],
    () => apiRequest.get(`USERS`).then((response) => response.data.users),
    props,
  );

  return {
    ...result,
    data: defaultTo(result.data, {}),
  };
}

/**
 * Retrieve details of the given user.
 */
export function useUser(id, props) {
  const apiRequest = useApiRequest();

  return useQuery(
    ['USER', id],
    () => apiRequest.get(`users/${id}`).then((response) => response.data.item),
    props,
  );
}
