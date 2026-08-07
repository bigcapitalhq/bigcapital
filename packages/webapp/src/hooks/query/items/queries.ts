import {
  fetchItems,
  fetchItem,
  fetchItemInvoices,
  fetchItemBills,
  fetchItemEstimates,
  fetchItemReceipts,
  fetchItemWarehouses,
  fetchInventoryCostItems,
  createItem,
  editItem,
  deleteItem,
  inactivateItem,
  activateItem,
  validateBulkDeleteItems,
  bulkDeleteItems,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { itemsCategoriesKeys } from '../items-categories/query-keys';
import { itemsKeys } from './query-keys';
import type {
  Item,
  CreateItemBody,
  EditItemBody,
  BulkDeleteItemsBody,
  ValidateBulkDeleteItemsResponse,
  ItemsListResponse,
  ItemAssociatedInvoicesResponse,
  ItemAssociatedBillsResponse,
  ItemAssociatedEstimatesResponse,
  ItemAssociatedReceiptsResponse,
  ItemWarehousesResponse,
} from '@bigcapital/sdk-ts';
import type {
  GetInventoryItemsCostQuery,
  GetInventoryItemsCostResponse,
} from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: itemsKeys.all() });
  queryClient.invalidateQueries({ queryKey: itemsCategoriesKeys.all() });
};

export function useCreateItem(
  props?: UseMutationOptions<void, Error, CreateItemBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: CreateItemBody) => createItem(fetcher, values),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useEditItem(
  props?: UseMutationOptions<void, Error, [number, EditItemBody]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, EditItemBody]) =>
      editItem(fetcher, id, values),
    onSuccess: (_data, [id]) => {
      queryClient.invalidateQueries({ queryKey: itemsKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useDeleteItem(props?: UseMutationOptions<void, Error, number>) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => deleteItem(fetcher, id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: itemsKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useBulkDeleteItems(
  props?: UseMutationOptions<
    void,
    Error,
    { ids: number[]; skipUndeletable?: boolean }
  >,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ({
      ids,
      skipUndeletable = false,
    }: {
      ids: number[];
      skipUndeletable?: boolean;
    }) =>
      bulkDeleteItems(fetcher, { ids, skipUndeletable } as BulkDeleteItemsBody),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useValidateBulkDeleteItems(
  props?: UseMutationOptions<ValidateBulkDeleteItemsResponse, Error, number[]>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...props,
    mutationFn: (ids: number[]) =>
      validateBulkDeleteItems(fetcher, {
        ids,
        skipUndeletable: false,
      } as BulkDeleteItemsBody),
  });
}

export function useActivateItem(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => activateItem(fetcher, id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: itemsKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useInactivateItem(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => inactivateItem(fetcher, id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: itemsKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useItems(
  query?: Record<string, unknown>,
  props?: Omit<UseQueryOptions<ItemsListResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: itemsKeys.list(query),
    queryFn: () =>
      (
        fetchItems as (
          f: ReturnType<typeof useApiFetcher>,
          q?: Record<string, unknown>,
        ) => Promise<ItemsListResponse>
      )(fetcher, query),
  });
}

export function useRefreshItems() {
  const queryClient = useQueryClient();
  return {
    refresh: () => queryClient.invalidateQueries({ queryKey: itemsKeys.all() }),
  };
}

export function useItem(
  id: number | null | undefined,
  props?: Omit<UseQueryOptions<Item>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: itemsKeys.detail(id),
    queryFn: () => fetchItem(fetcher, id!),
    enabled: id != null,
  });
}

export function useItemAssociatedInvoiceTransactions(
  id: number | null | undefined,
  props?: Omit<
    UseQueryOptions<ItemAssociatedInvoicesResponse>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: itemsKeys.associatedInvoices(id),
    queryFn: () => fetchItemInvoices(fetcher, id!),
    enabled: id != null,
  });
}

export function useItemAssociatedEstimateTransactions(
  id: number | null | undefined,
  props?: Omit<
    UseQueryOptions<ItemAssociatedEstimatesResponse>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: itemsKeys.associatedEstimates(id),
    queryFn: () => fetchItemEstimates(fetcher, id!),
    enabled: id != null,
  });
}

export function useItemAssociatedReceiptTransactions(
  id: number | null | undefined,
  props?: Omit<
    UseQueryOptions<ItemAssociatedReceiptsResponse>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: itemsKeys.associatedReceipts(id),
    queryFn: () => fetchItemReceipts(fetcher, id!),
    enabled: id != null,
  });
}

export function useItemAssociatedBillTransactions(
  id: number | null | undefined,
  props?: Omit<
    UseQueryOptions<ItemAssociatedBillsResponse>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: itemsKeys.associatedBills(id),
    queryFn: () => fetchItemBills(fetcher, id!),
    enabled: id != null,
  });
}

export function useItemWarehouseLocation(
  id: number | null | undefined,
  props?: Omit<UseQueryOptions<ItemWarehousesResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: itemsKeys.warehousesLocation(id),
    queryFn: () => fetchItemWarehouses(fetcher, id!),
    enabled: id != null,
  });
}

export function useItemInventoryCost(
  query?: GetInventoryItemsCostQuery,
  props?: Omit<
    UseQueryOptions<GetInventoryItemsCostResponse['costs']>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher();
  return useQuery({
    ...props,
    queryKey: itemsKeys.inventoryCost(query),
    queryFn: () =>
      fetchInventoryCostItems(
        fetcher,
        query as GetInventoryItemsCostQuery,
      ).then((res: GetInventoryItemsCostResponse) => res.costs ?? []),
  });
}
