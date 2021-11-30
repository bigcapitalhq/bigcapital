import { useQueryClient, useMutation } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import { transformPagination } from 'utils';
import useApiRequest from '../useRequest';
import t from './types';

const commonInvalidateQueries = (queryClient) => {
  // Invalidate vendor credit.
  queryClient.invalidateQueries(t.VENDOR_CREDITS);
  queryClient.invalidateQueries(t.VENDOR_CREDIT);

  // Invalidate items.
  queryClient.invalidateQueries(t.ITEMS);
  queryClient.invalidateQueries(t.ITEM);

  // Invalidate vendors.
  queryClient.invalidateQueries([t.VENDORS]);
  queryClient.invalidateQueries(t.VENDOR);

  // Invalidate accounts.
  queryClient.invalidateQueries(t.ACCOUNTS);
  queryClient.invalidateQueries(t.ACCOUNT);

  // Invalidate financial reports.
  queryClient.invalidateQueries(t.FINANCIAL_REPORT);
};

/**
 * Create a new vendor credit.
 */
export function useCreateVendorCredit(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (values) => apiRequest.post('purchases/vendor-credit', values),
    {
      onSuccess: (res, values) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Edit the given vendor credit.
 */
export function useEditVendorCredit(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`purchases/vendor-credit/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);

        // Invalidate vendor credit query.
        queryClient.invalidateQueries([t.VENDOR_CREDIT, id]);
      },
      ...props,
    },
  );
}

/**
 * Delete the given vendor credit.
 */
export function useDeleteVendorCredit(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.delete(`purchases/vendor-credit/${id}`),
    {
      onSuccess: (res, id) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);

        // Invalidate vendor credit query.
        queryClient.invalidateQueries([t.VENDOR_CREDIT_NOTE, id]);
      },
      ...props,
    },
  );
}

const transformVendorCreditsResponse = (response) => ({
  vendorCredits: response.data.vendor_credits,
  pagination: transformPagination(response.data.pagination),
  filterMeta: response.data.filter_meta,
});

/**
 * Retrieve vendor credit notes list with pagination meta.
 */
export function useVendorCredits(query, props) {
  return useRequestQuery(
    [t.VENDOR_CREDITS],
    {
      method: 'get',
      url: 'purchases/vendor-credit',
      params: query,
    },
    {
      select: transformVendorCreditsResponse,
      defaultData: {
        vendorCredits: [],
        pagination: {
          page: 1,
          page_size: 12,
          total: 0,
        },
        filterMeta: {},
      },
      ...props,
    },
  );
}

/**
 * Retrieve vendor credit detail of the given id.
 * @param {number} id
 *
 */
export function useVendorCredit(id, props, requestProps) {
  return useRequestQuery(
    [t.VENDOR_CREDIT, id],
    { method: 'get', url: `purchases/vendor-credit/${id}`, ...requestProps },
    {
      select: (res) => res.data.data,
      defaultData: {},
      ...props,
    },
  );
}

export function useRefreshVendorCredits() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries(t.VENDOR_CREDITS);
    },
  };
}
