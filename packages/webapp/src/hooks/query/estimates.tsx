// @ts-nocheck
import { useQueryClient, useMutation } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import useApiRequest from '../useRequest';
import { transformPagination } from '@/utils';
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

export function useSendSaleEstimateMail(props) {
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

export function useSaleEstimateDefaultOptions(estimateId, props) {
  return useRequestQuery(
    [t.SALE_ESTIMATE_MAIL_OPTIONS, estimateId],
    {
      method: 'get',
      url: `sales/estimates/${estimateId}/mail`,
    },
    {
      select: (res) => res.data.data,
      ...props,
    },
  );
}
