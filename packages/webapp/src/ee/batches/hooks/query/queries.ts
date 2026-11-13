import { rawRequest } from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import * as qs from 'qs';
import { batchesKeys } from './query-keys';
import { useApiFetcher } from '@/hooks/useRequest';
import { transfromToSnakeCase } from '@/utils';

export type BatchStatus = 'active' | 'expiring_soon' | 'expired' | 'depleted';

export interface Batch {
  id: number;
  itemId: number;
  batchNumber: string;
  batchRef?: string | null;
  manufacturedDate?: string | null;
  expiryDate?: string | null;
  quantity: number;
  quantityIn: number;
  quantityOut: number;
  quantityOnHand: number;
  status: BatchStatus;
  createdAt?: string;
  updatedAt?: string;
  item?: {
    id: number;
    name: string;
    code?: string | null;
    type?: string;
  };
}

export interface BatchesListResponse {
  results: Batch[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface BatchesQuery {
  itemId?: number;
  itemsIds?: number[];
  search?: string;
  status?: BatchStatus;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateBatchBody {
  itemId: number;
  batchNumber: string;
  batchRef?: string;
  manufacturedDate?: string;
  expiryDate?: string;
  quantity: number;
  sourceTransactionType?: string;
  sourceTransactionId?: number;
}

export interface EditBatchBody extends Partial<CreateBatchBody> {
  id: number;
}

export interface BatchDetailsReportQuery {
  fromDate?: string;
  toDate?: string;
  itemsIds?: number[];
  status?: BatchStatus;
  search?: string;
}

export interface BatchDetailsReportResponse {
  table: {
    columns: Array<{ key: string; label: string }>;
    rows: Array<{
      id?: string;
      rowTypes?: string[];
      cells: Array<{ key: string; value: string }>;
    }>;
  };
  query: Record<string, unknown>;
  meta: {
    organizationName: string;
    baseCurrency: string;
    dateFormat: string;
    sheetName: string;
    formattedAsDate?: string;
    formattedDateRange?: string;
  };
}

/**
 * Builds the query string of the given query object in the snake_case wire
 * format expected by the server.
 */
export const buildBatchesQueryString = (query?: Record<string, unknown>) => {
  if (!query) return '';
  const params = qs.stringify(transfromToSnakeCase(query), {
    arrayFormat: 'brackets',
    skipNulls: true,
  });
  return params ? `?${params}` : '';
};

/**
 * Retrieves the batches list.
 */
export function useBatches(
  query?: BatchesQuery,
  props?: Omit<UseQueryOptions<BatchesListResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: batchesKeys.list(query as Record<string, unknown>),
    queryFn: () =>
      rawRequest<BatchesListResponse>(
        fetcher,
        'GET',
        `/api/batches${buildBatchesQueryString(query as Record<string, unknown>)}`,
      ),
  });
}

/**
 * Retrieves the batches of the given item.
 */
export function useItemBatches(
  itemId: number | null | undefined,
  props?: Omit<UseQueryOptions<BatchesListResponse>, 'queryKey' | 'queryFn'>,
) {
  return useBatches(
    { itemId: itemId as number },
    {
      ...props,
      enabled: itemId != null && (props?.enabled ?? true),
    },
  );
}

/**
 * Retrieves the available batches of the given item.
 */
export function useAvailableItemBatches(
  itemId: number | null | undefined,
  props?: Omit<UseQueryOptions<Batch[]>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: batchesKeys.availableBatches(itemId),
    queryFn: () =>
      rawRequest<Batch[]>(
        fetcher,
        'GET',
        `/api/batches/available${buildBatchesQueryString({
          itemId: itemId as number,
        })}`,
      ),
    enabled: itemId != null && (props?.enabled ?? true),
  });
}

/**
 * Creates a new batch.
 */
export function useCreateBatch(
  props?: UseMutationOptions<Batch, Error, CreateBatchBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...props,
    mutationFn: (values: CreateBatchBody) =>
      rawRequest<Batch>(fetcher, 'POST', '/api/batches', {
        ...values,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchesKeys.all() });
      queryClient.invalidateQueries({ queryKey: batchesKeys.reportAll() });
    },
  });
}

/**
 * Updates the given batch.
 */
export function useEditBatch(
  props?: UseMutationOptions<Batch, Error, EditBatchBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...props,
    mutationFn: ({ id, ...values }: EditBatchBody) =>
      rawRequest<Batch>(fetcher, 'PUT', `/api/batches/${id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchesKeys.all() });
      queryClient.invalidateQueries({ queryKey: batchesKeys.reportAll() });
    },
  });
}

/**
 * Deletes the given batch.
 */
export function useDeleteBatch(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...props,
    mutationFn: (id: number) =>
      rawRequest<void>(fetcher, 'DELETE', `/api/batches/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchesKeys.all() });
      queryClient.invalidateQueries({ queryKey: batchesKeys.reportAll() });
    },
  });
}

/**
 * Retrieves the batch details report.
 */
export function useBatchDetailsReport(
  query: BatchDetailsReportQuery,
  props?: Omit<
    UseQueryOptions<BatchDetailsReportResponse>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: batchesKeys.report(query as Record<string, unknown>),
    queryFn: () =>
      rawRequest<BatchDetailsReportResponse>(
        fetcher,
        'GET',
        `/api/reports/batch-details${buildBatchesQueryString(
          query as Record<string, unknown>,
        )}`,
      ),
  });
}
