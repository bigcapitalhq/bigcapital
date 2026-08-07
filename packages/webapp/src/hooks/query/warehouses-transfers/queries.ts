import {
  fetchWarehouseTransfers,
  fetchWarehouseTransfer,
  createWarehouseTransfer,
  editWarehouseTransfer,
  deleteWarehouseTransfer,
  initiateWarehouseTransfer,
  transferredWarehouseTransfer,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { itemsKeys } from '../items/query-keys';
import { warehousesTransfersKeys } from './query-keys';
import type {
  CreateWarehouseTransferBody,
  EditWarehouseTransferBody,
  WarehouseTransfer,
  WarehouseTransfersListResponse,
} from '@bigcapital/sdk-ts';

/** Query params for listing warehouse transfers (pagination, filter, etc.). */
type GetWarehouseTransfersQuery = Record<
  string,
  string | number | boolean | undefined
>;

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: warehousesTransfersKeys.all() });
  queryClient.invalidateQueries({ queryKey: itemsKeys.all() });
};

/**
 * Create a new warehouse transfer.
 */
export function useCreateWarehouseTransfer(
  props?: UseMutationOptions<void, Error, CreateWarehouseTransferBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: CreateWarehouseTransferBody) =>
      createWarehouseTransfer(fetcher, values),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

/**
 * Edits the given warehouse transfer.
 */
export function useEditWarehouseTransfer(
  props?: UseMutationOptions<void, Error, [number, EditWarehouseTransferBody]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, EditWarehouseTransferBody]) =>
      editWarehouseTransfer(fetcher, id, values),
    onSuccess: (_, [id]) => {
      queryClient.invalidateQueries({
        queryKey: warehousesTransfersKeys.detail(id),
      });
      commonInvalidateQueries(queryClient);
    },
  });
}

/**
 * Deletes the given warehouse Transfer.
 */
export function useDeleteWarehouseTransfer(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => deleteWarehouseTransfer(fetcher, id),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

/**
 * Retrieve Warehouses list.
 */
export function useWarehousesTransfers(
  query?: GetWarehouseTransfersQuery | null,
  props?: Omit<
    UseQueryOptions<WarehouseTransfersListResponse>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher();
  return useQuery({
    ...props,
    queryKey: warehousesTransfersKeys.list(query ?? undefined),
    queryFn: () =>
      (
        fetchWarehouseTransfers as (
          fetcher: unknown,
          query?: GetWarehouseTransfersQuery,
        ) => Promise<WarehouseTransfersListResponse>
      )(fetcher, query ?? undefined),
  });
}

/**
 * Retrieve the warehouse transfer details.
 */
export function useWarehouseTransfer(
  id: number | null | undefined,
  props?: Omit<UseQueryOptions<WarehouseTransfer>, 'queryKey' | 'queryFn'>,
  _requestProps?: Record<string, unknown>,
) {
  const fetcher = useApiFetcher();
  return useQuery({
    ...props,
    queryKey: warehousesTransfersKeys.detail(id),
    queryFn: () => fetchWarehouseTransfer(fetcher, id!),
    enabled: id != null,
  });
}

/**
 * Initiate warehouse transfer.
 */
export function useInitiateWarehouseTransfer(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => initiateWarehouseTransfer(fetcher, id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: warehousesTransfersKeys.detail(id),
      });
      commonInvalidateQueries(queryClient);
    },
  });
}

/**
 * Mark warehouse transfer as transferred.
 */
export function useTransferredWarehouseTransfer(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => transferredWarehouseTransfer(fetcher, id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: warehousesTransfersKeys.detail(id),
      });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useRefreshWarehouseTransfers() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries({
        queryKey: warehousesTransfersKeys.all(),
      });
    },
  };
}
