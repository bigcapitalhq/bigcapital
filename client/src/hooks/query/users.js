import { useMutation, useQueryClient, useQuery } from 'react-query';
import { defaultTo } from 'lodash';
import ApiService from 'services/ApiService';

/**
 * Create a new invite user.
 */
export function useCreateInviteUser(props) {
  const queryClient = useQueryClient();
  return useMutation((values) => ApiService.post('invite/send', values), {
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

  return useMutation(([id, values]) => ApiService.post(`users/${id}`, values), {
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

  return useMutation((id) => ApiService.delete(`users/${id}`), {
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
  const result = useQuery(
    ['USERS'],
    () => ApiService.get(`USERS`).then((response) => response.data.users),
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
  return useQuery(
    ['USER', id],
    () => ApiService.get(`users/${id}`).then((response) => response.data.item),
    props,
  );
}
