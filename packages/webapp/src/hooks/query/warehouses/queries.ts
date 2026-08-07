import {
  fetchWarehouses,
  fetchWarehouse,
  createWarehouse,
  editWarehouse,
  deleteWarehouse,
  activateWarehouses,
  markWarehousePrimary,
} from '@bigcapital/sdk-ts';
import {
  useQueryClient,
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { usersKeys } from '../users/query-keys';
import { warehousesTransfersKeys } from '../warehouses-transfers/query-keys';
import { warehousesKeys } from './query-keys';
import type {
  Warehouse,
  WarehousesListResponse,
  CreateWarehouseBody,
  EditWarehouseBody,
} from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: warehousesKeys.all() });
  queryClient.invalidateQueries({ queryKey: warehousesTransfersKeys.all() });
  queryClient.invalidateQueries({ queryKey: usersKeys.dashboardMeta() });
};

export function useCreateWarehouse(
  props?: UseMutationOptions<void, Error, CreateWarehouseBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: CreateWarehouseBody) =>
      createWarehouse(fetcher, values),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useEditWarehouse(
  props?: UseMutationOptions<void, Error, [number, EditWarehouseBody]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, EditWarehouseBody]) =>
      editWarehouse(fetcher, String(id), values),
    onSuccess: (_data, [id]) => {
      queryClient.invalidateQueries({ queryKey: warehousesKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useDeleteWarehouse(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => deleteWarehouse(fetcher, String(id)),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: warehousesKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useWarehouses(
  query?: Record<string, unknown>,
  props?: Omit<UseQueryOptions<WarehousesListResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher();
  return useQuery({
    ...props,
    queryKey: warehousesKeys.list(query),
    queryFn: () => fetchWarehouses(fetcher),
  });
}

export function useWarehouse(
  id: number | string | null | undefined,
  props?: Omit<UseQueryOptions<Warehouse>, 'queryKey' | 'queryFn'>,
  _requestProps?: Record<string, unknown>,
) {
  const fetcher = useApiFetcher();
  const idStr = id != null ? String(id) : '';
  return useQuery({
    ...props,
    queryKey: warehousesKeys.detail(id),
    queryFn: () => fetchWarehouse(fetcher, idStr),
    enabled: id != null && idStr !== '',
  });
}

export function useActivateWarehouses(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (_id: number) => activateWarehouses(fetcher),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useMarkWarehouseAsPrimary(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => markWarehousePrimary(fetcher, String(id)),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: warehousesKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}
