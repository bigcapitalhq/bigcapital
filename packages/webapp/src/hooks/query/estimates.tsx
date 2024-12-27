// @ts-nocheck
import {
  useQueryClient,
  useMutation,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import useApiRequest from '../useRequest';
import { transformPagination, transformToCamelCase } from '@/utils';
import t from './types';
import { useRequestPdf } from '../useRequestPdf';

const commonInvalidateQueries = (queryClient) => {
  // Invalidate estimates.
  queryClient.invalidateQueries(t.SALE_ESTIMATES);

  // Invalidate
  queryClient.invalidateQueries(t.ITEM_ASSOCIATED_WITH_ESTIMATES);
};

/**
 * Creates a new sale estimate.
 */
export function useCreateEstimate(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('sales/estimates', values), {
    onSuccess: () => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);

      // Invalidate the settings.
      queryClient.invalidateQueries([t.SETTING, t.SETTING_ESTIMATES]);
    },
    ...props,
  });
}

/**
 * Edits the given sale estimate.
 */
export function useEditEstimate(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`sales/estimates/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);

        // Invalidate specific sale estimate.
        queryClient.invalidateQueries([t.SALE_ESTIMATE, id]);
      },
      ...props,
    },
  );
}

/**
 * Retrieve sale estimate details.
 */
export function useEstimate(id, props) {
  return useRequestQuery(
    [t.SALE_ESTIMATE, id],
    { method: 'get', url: `sales/estimates/${id}` },
    {
      select: (res) => res.data.estimate,
      defaultData: {},
      ...props,
    },
  );
}

const transformEstimates = (res) => ({
  estimates: res.data.sales_estimates,
  pagination: transformPagination(res.data.pagination),
  filterMeta: res.data.filter_meta,
});

/**
 * Retrieve sale invoices list with pagination meta.
 */
export function useEstimates(query, props) {
  return useRequestQuery(
    [t.SALE_ESTIMATES, query],
    { method: 'get', url: 'sales/estimates', params: query },
    {
      select: transformEstimates,
      defaultData: {
        estimates: [],
        pagination: {
          page: 1,
          pageSize: 20,
          total: 0,
        },
        filterMeta: {},
      },
      ...props,
    },
  );
}

/**
 * Deletes the given sale invoice.
 */
export function useDeleteEstimate(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`sales/estimates/${id}`), {
    onSuccess: (res, id) => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);

      // Invalidate specific sale estimate.
      queryClient.invalidateQueries([t.SALE_ESTIMATE, id]);
    },
    ...props,
  });
}

/**
 * Mark the given estimate as delivered.
 */
export function useDeliverEstimate(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`sales/estimates/${id}/deliver`), {
    onSuccess: (res, id) => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);

      // Invalidate specific sale estimate.
      queryClient.invalidateQueries([t.SALE_ESTIMATE, id]);
    },
    ...props,
  });
}

/**
 * Mark the given estimate as approved.
 */
export function useApproveEstimate(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`sales/estimates/${id}/approve`), {
    onSuccess: (res, id) => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);

      // Invalidate specific sale estimate.
      queryClient.invalidateQueries([t.SALE_ESTIMATE, id]);
    },
    ...props,
  });
}

/**
 * Mark the given estimate as rejected.
 */
export function useRejectEstimate(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`sales/estimates/${id}/reject`), {
    onSuccess: (res, id) => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);

      // Invalidate specific sale estimate.
      queryClient.invalidateQueries([t.SALE_ESTIMATE, id]);
    },
    ...props,
  });
}

/**
 * Retrieve the estimate pdf document data,
 */

export function usePdfEstimate(estimateId) {
  return useRequestPdf({
    url: `sales/estimates/${estimateId}`,
  });
}

export function useRefreshEstimates() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries(t.SALE_ESTIMATES);
    },
  };
}

/**
 *
 */
export function useCreateNotifyEstimateBySMS(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) =>
      apiRequest.post(`sales/estimates/${id}/notify-by-sms`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Invalidate
        queryClient.invalidateQueries([t.NOTIFY_SALE_ESTIMATE_BY_SMS, id]);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 *
 * @param {*} estimateId
 * @param {*} props
 * @param {*} requestProps
 * @returns
 */
export function useEstimateSMSDetail(estimateId, props, requestProps) {
  return useRequestQuery(
    [t.SALE_ESTIMATE_SMS_DETAIL, estimateId],
    {
      method: 'get',
      url: `sales/estimates/${estimateId}/sms-details`,
      ...requestProps,
    },
    {
      select: (res) => res.data.data,
      defaultData: {},
      ...props,
    },
  );
}

export function useSendSaleEstimateMail(props = {}) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`sales/estimates/${id}/mail`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

export interface SaleEstimateMailStateResponse {
  attachEstimate: boolean;
  companyLogoUri: string;
  companyName: string;
  customerName: string;
  entries: Array<any>;

  estimateDate: string;
  estimateDateFormatted: string;

  expirationDate: string;
  expirationDateFormatted: string;

  primaryColor: string;

  total: number;
  totalFormatted: string;

  subtotal: number;
  subtotalFormatted: string;

  discountAmount: number;
  discountAmountFormatted: string;
  discountLabel: string;
  discountPercentage: number | null;
  discountPercentageFormatted: string;

  adjustment: number;
  adjustmentFormatted: string;

  estimateNumber: string;

  formatArgs: {
    customerName: string;
    estimateAmount: string;
  };
  from: Array<string>;
  fromOptions: Array<any>;
  message: string;
  subject: string;
  to: Array<string>;
  toOptions: Array<any>;
}

/**
 * Retrieves the sale estimate mail state.
 * @param {number} estimateId
 * @param {UseQueryOptions<SaleEstimateMailStateResponse, Error>} props
 * @returns {UseQueryResult<SaleEstimateMailStateResponse, Error>}
 */
export function useSaleEstimateMailState(
  estimateId: number,
  props?: UseQueryOptions<SaleEstimateMailStateResponse, Error>,
): UseQueryResult<SaleEstimateMailStateResponse, Error> {
  const apiRequest = useApiRequest();
  return useQuery([t.SALE_ESTIMATE_MAIL_OPTIONS, estimateId], () =>
    apiRequest
      .get(`sales/estimates/${estimateId}/mail/state`)
      .then((res) => transformToCamelCase(res.data.data)),
  );
}

export interface ISaleEstimatesStateResponse {
  defaultTemplateId: number;
}

export function useGetSaleEstimatesState(
  options?: UseQueryOptions<ISaleEstimatesStateResponse, Error>,
): UseQueryResult<ISaleEstimatesStateResponse, Error> {
  const apiRequest = useApiRequest();

  return useQuery<ISaleEstimatesStateResponse, Error>(
    ['SALE_ESTIMATE_STATE'],
    () =>
      apiRequest
        .get('/sales/estimates/state')
        .then((res) => transformToCamelCase(res.data?.data)),
    { ...options },
  );
}

interface GetEstimateHtmlResponse {
  htmlContent: string;
}
/**
 * Retrieves the sale estimate html content.
 * @param {number} invoiceId
 * @param {UseQueryOptions<GetEstimateHtmlResponse>} options
 * @returns {UseQueryResult<GetEstimateHtmlResponse>}
 */
export const useGetSaleEstimateHtml = (
  estimateId: number,
  options?: UseQueryOptions<GetEstimateHtmlResponse>,
): UseQueryResult<GetEstimateHtmlResponse> => {
  const apiRequest = useApiRequest();

  return useQuery<GetEstimateHtmlResponse>(
    ['SALE_ESTIMATE_HTML', estimateId],
    () =>
      apiRequest
        .get(`sales/estimates/${estimateId}`, {
          headers: {
            Accept: 'application/json+html',
          },
        })
        .then((res) => transformToCamelCase(res.data)),
  );
};
