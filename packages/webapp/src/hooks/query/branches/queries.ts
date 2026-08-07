import {
  fetchBranches,
  fetchBranch,
  createBranch,
  editBranch,
  deleteBranch,
  activateBranches,
  markBranchAsPrimary,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { usersKeys } from '../users/query-keys';
import { branchesKeys } from './query-keys';
import type {
  Branch,
  BranchesListResponse,
  CreateBranchBody,
  EditBranchBody,
} from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: branchesKeys.all() });
  queryClient.invalidateQueries({ queryKey: usersKeys.dashboardMeta() });
};

export function useCreateBranch(
  props?: UseMutationOptions<void, Error, CreateBranchBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: CreateBranchBody) => createBranch(fetcher, values),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useEditBranch(
  props?: UseMutationOptions<void, Error, [number | string, EditBranchBody]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number | string, EditBranchBody]) =>
      editBranch(fetcher, String(id), values),
    onSuccess: (_data, [id]) => {
      queryClient.invalidateQueries({ queryKey: branchesKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useDeleteBranch(
  props?: UseMutationOptions<void, Error, number | string>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number | string) => deleteBranch(fetcher, String(id)),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: branchesKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useBranches(
  query?: Record<string, unknown>,
  props?: Omit<UseQueryOptions<BranchesListResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: branchesKeys.list(query),
    queryFn: () => fetchBranches(fetcher),
  });
}

export function useBranch(
  id: number | string | null | undefined,
  props?: Omit<UseQueryOptions<Branch>, 'queryKey' | 'queryFn'>,
  _requestProps?: Record<string, unknown>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: branchesKeys.detail(id),
    queryFn: () => fetchBranch(fetcher, String(id!)),
    enabled: id != null,
  });
}

export function useActivateBranches(
  props?: UseMutationOptions<void, Error, number | string>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: () => activateBranches(fetcher),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useMarkBranchAsPrimary(
  props?: UseMutationOptions<void, Error, number | string>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number | string) =>
      markBranchAsPrimary(fetcher, String(id)),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: branchesKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}
