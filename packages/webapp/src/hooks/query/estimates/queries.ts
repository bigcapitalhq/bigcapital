import {
  fetchSaleEstimates,
  fetchSaleEstimate,
  createSaleEstimate,
  editSaleEstimate,
  deleteSaleEstimate,
  bulkDeleteSaleEstimates,
  validateBulkDeleteSaleEstimates,
  deliverSaleEstimate,
  approveSaleEstimate,
  rejectSaleEstimate,
  notifySaleEstimateBySms,
  fetchSaleEstimateSmsDetails,
  fetchSaleEstimateMail,
  sendSaleEstimateMail,
  fetchSaleEstimatesState,
  fetchSaleEstimateHtmlContent,
} from '@bigcapital/sdk-ts';
import {
  useQueryClient,
  useMutation,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
  UseMutationOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { useRequestPdf } from '../../useRequestPdf';
import { itemsKeys } from '../items/query-keys';
import { settingsKeys } from '../settings/query-keys';
import { estimatesKeys } from './query-keys';
import type {
  SaleEstimate,
  SaleEstimatesListResponse,
  CreateSaleEstimateBody,
  EditSaleEstimateBody,
  SaleEstimateHtmlContentResponse,
  BulkDeleteEstimatesBody,
  ValidateBulkDeleteEstimatesResponse,
  SaleEstimatesStateResponse,
  SaleEstimateMailStateResponse,
} from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: estimatesKeys.all() });
  queryClient.invalidateQueries({
    queryKey: itemsKeys.associatedEstimates(null).slice(0, 1),
  });
};

export function useCreateEstimate(
  props?: UseMutationOptions<void, Error, CreateSaleEstimateBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: CreateSaleEstimateBody) =>
      createSaleEstimate(fetcher, values),
    onSuccess: () => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: settingsKeys.estimates() });
    },
  });
}

export function useEditEstimate(
  props?: UseMutationOptions<void, Error, [number, EditSaleEstimateBody]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, EditSaleEstimateBody]) =>
      editSaleEstimate(fetcher, id, values),
    onSuccess: (_data, [id]) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: estimatesKeys.detail(id) });
    },
  });
}

export function useEstimate(
  id: number | null | undefined,
  props?: Omit<UseQueryOptions<SaleEstimate>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: estimatesKeys.detail(id),
    queryFn: () => fetchSaleEstimate(fetcher, id!),
    enabled: id != null,
  });
}

/**
 * Variant of {@link useEstimate} that enables the snake_case → camelCase
 * response transform, so the returned data matches the `SaleEstimate` SDK type
 * at runtime. Use this for new camelCase-consuming code (e.g. detail drawers).
 */
export function useEstimateDetail(
  id: number | null | undefined,
  props?: Omit<UseQueryOptions<SaleEstimate>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: estimatesKeys.detail(id),
    queryFn: () => fetchSaleEstimate(fetcher, id!),
    enabled: id != null,
  });
}

export function useEstimates(
  query?: Record<string, unknown>,
  props?: Omit<
    UseQueryOptions<SaleEstimatesListResponse>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: estimatesKeys.list(query),
    queryFn: () => fetchSaleEstimates(fetcher, query),
  });
}

export function useDeleteEstimate(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => deleteSaleEstimate(fetcher, id),
    onSuccess: (_data, id) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: estimatesKeys.detail(id) });
    },
  });
}

export function useBulkDeleteEstimates(
  props?: UseMutationOptions<void, Error, BulkDeleteEstimatesBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (body: BulkDeleteEstimatesBody) =>
      bulkDeleteSaleEstimates(fetcher, body),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useValidateBulkDeleteEstimates(
  props?: UseMutationOptions<
    ValidateBulkDeleteEstimatesResponse,
    Error,
    number[]
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...props,
    mutationFn: (ids: number[]) =>
      validateBulkDeleteSaleEstimates(fetcher, ids),
  });
}

export function useDeliverEstimate(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => deliverSaleEstimate(fetcher, id),
    onSuccess: (_data, id) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: estimatesKeys.detail(id) });
    },
  });
}

export function useApproveEstimate(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => approveSaleEstimate(fetcher, id),
    onSuccess: (_data, id) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: estimatesKeys.detail(id) });
    },
  });
}

export function useRejectEstimate(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => rejectSaleEstimate(fetcher, id),
    onSuccess: (_data, id) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: estimatesKeys.detail(id) });
    },
  });
}

export function usePdfEstimate(estimateId: number) {
  return useRequestPdf({
    url: `sale-estimates/${estimateId}`,
  });
}

export function useRefreshEstimates() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: estimatesKeys.all() });
    },
  };
}

export function useCreateNotifyEstimateBySMS(
  props?: UseMutationOptions<void, Error, [number, Record<string, unknown>]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, Record<string, unknown>]) =>
      notifySaleEstimateBySms(fetcher, id, values),
    onSuccess: (_data, [id]) => {
      queryClient.invalidateQueries({
        queryKey: estimatesKeys.notifyBySms(id),
      });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useEstimateSMSDetail(
  estimateId: number | null | undefined,
  props?: Record<string, unknown>,
  requestProps?: Record<string, unknown>,
) {
  const fetcher = useApiFetcher();
  return useQuery({
    ...props,
    queryKey: estimatesKeys.smsDetail(estimateId),
    queryFn: () => fetchSaleEstimateSmsDetails(fetcher, estimateId!),
    enabled: estimateId != null,
    ...requestProps,
  });
}

export function useSendSaleEstimateMail(
  props?: UseMutationOptions<void, Error, [number, Record<string, unknown>]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, Record<string, unknown>]) =>
      sendSaleEstimateMail(fetcher, id, values),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useSaleEstimateMailState(
  estimateId: number,
  props?: UseQueryOptions<SaleEstimateMailStateResponse, Error>,
): UseQueryResult<SaleEstimateMailStateResponse, Error> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: estimatesKeys.mailOptions(estimateId),
    queryFn: () => fetchSaleEstimateMail(fetcher, estimateId),
  });
}

export function useGetSaleEstimatesState(
  options?: UseQueryOptions<SaleEstimatesStateResponse, Error>,
): UseQueryResult<SaleEstimatesStateResponse, Error> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...options,
    queryKey: estimatesKeys.state(),
    queryFn: () => fetchSaleEstimatesState(fetcher),
  });
}

/**
 * Retrieves the sale estimate html content.
 */
export const useGetSaleEstimateHtml = (
  estimateId: number,
  options?: UseQueryOptions<SaleEstimateHtmlContentResponse>,
): UseQueryResult<SaleEstimateHtmlContentResponse> => {
  const fetcher = useApiFetcher();

  return useQuery({
    ...options,
    queryKey: estimatesKeys.html(estimateId),
    queryFn: () => fetchSaleEstimateHtmlContent(fetcher, estimateId),
  });
};
