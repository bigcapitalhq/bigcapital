import {
  fetchUsers,
  fetchUser,
  inviteUser,
  editUser,
  inactivateUser,
  activateUser,
  deleteUser,
  fetchAuthedAccount,
  fetchDashboardBootMeta,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSetAuthEmailConfirmed } from '../../state';
import { useSetFeatureDashboardMeta } from '../../state/feature';
import { useApiFetcher } from '../../useRequest';
import { usersKeys } from './query-keys';
import type {
  UsersListResponse,
  User,
  EditUserBody,
  InviteUserBody,
  GetDashboardBootMetaResponse,
  AuthedAccount,
} from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: usersKeys.all() });
};

export function useCreateInviteUser(
  props?: UseMutationOptions<void, Error, InviteUserBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: InviteUserBody) => inviteUser(fetcher, values),
    onSuccess: () => {
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useEditUser(
  props?: UseMutationOptions<void, Error, [number, EditUserBody]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, EditUserBody]) =>
      editUser(fetcher, id, values),
    onSuccess: (_res, [id]) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useInactivateUser(
  props?: UseMutationOptions<void, Error, number>,
) {
  const fetcher = useApiFetcher();
  const queryClient = useQueryClient();

  return useMutation({
    ...props,
    mutationFn: (userId: number) => inactivateUser(fetcher, userId),
    onSuccess: (_res, userId) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(userId) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useActivateUser(
  props?: UseMutationOptions<void, Error, number>,
) {
  const fetcher = useApiFetcher();
  const queryClient = useQueryClient();

  return useMutation({
    ...props,
    mutationFn: (userId: number) => activateUser(fetcher, userId),
    onSuccess: (_res, userId) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(userId) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useDeleteUser(props?: UseMutationOptions<void, Error, number>) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => deleteUser(fetcher, id),
    onSuccess: (_res, id) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useUsers(
  props?: Omit<UseQueryOptions<UsersListResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: usersKeys.all(),
    queryFn: () => fetchUsers(fetcher),
  });
}

export function useUser(
  id: number | null | undefined,
  props?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: usersKeys.detail(id),
    queryFn: () => fetchUser(fetcher, id!),
    enabled: id != null,
  });
}

export function useAuthenticatedAccount(
  props?: Omit<UseQueryOptions<AuthedAccount>, 'queryKey' | 'queryFn'>,
) {
  const setEmailConfirmed = useSetAuthEmailConfirmed();
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  const state = useQuery<AuthedAccount, Error>({
    ...props,
    queryKey: usersKeys.authenticatedAccount(),
    queryFn: () => fetchAuthedAccount(fetcher),
  });
  useEffect(() => {
    if (state.isSuccess && state.data) {
      setEmailConfirmed(state.data.verified, state.data.email);
    }
  }, [state.isSuccess, state.data, setEmailConfirmed]);
  return { ...state, data: state.data ?? ({} as AuthedAccount) };
}

export const useDashboardMeta = (
  props?: Omit<
    UseQueryOptions<GetDashboardBootMetaResponse>,
    'queryKey' | 'queryFn'
  >,
) => {
  const setFeatureDashboardMeta = useSetFeatureDashboardMeta();
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  const state = useQuery({
    ...props,
    queryKey: usersKeys.dashboardMeta(),
    queryFn: () => fetchDashboardBootMeta(fetcher),
  });
  useEffect(() => {
    if (state.isSuccess && state.data) {
      setFeatureDashboardMeta(state.data);
    }
  }, [state.isSuccess, state.data, setFeatureDashboardMeta]);
  return state;
};
