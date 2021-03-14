import { useMutation, useQuery, useQueryClient } from 'react-query';
import t from './types';
import { transformPagination } from 'utils';
import useApiRequest from '../useRequest';

// Common invalidate queries.
const commonInvalidateQueries = (queryClient) => {
  // Invalidate vendors list.
  queryClient.invalidateQueries(t.VENDORS);

  // Invalidate financial reports.
  queryClient.invalidateQueries(t.ACCOUNTS);
  queryClient.invalidateQueries(t.ACCOUNT);

  // Invalidate financial reports.
  queryClient.invalidateQueries(t.FINANCIAL_REPORT);
};

/**
 * Retrieve vendors list.
 */
export function useVendors(query, props) {
  const apiRequest = useApiRequest();

  return useQuery(
    [t.VENDORS, query],
    () => apiRequest.get(`vendors`, { params: query }),
    {
      select: (res) => ({
        vendors: res.data.vendors,
        pagination: transformPagination(res.data.pagination),
        filterMeta: res.data.filter_meta,
      }),
      initialDataUpdatedAt: 0,
      initialData: {
        data: {
          vendors: [],
          pagination: {},
          filter_meta: {},
        },
      },
      ...props,
    },
  );
}

/**
 * Edits details of the given vendor.
 */
export function useEditVendor(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`vendors/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Invalidate specific vendor.
        queryClient.invalidateQueries([t.VENDOR, id]);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Deletes the given vendor.
 */
export function useDeleteVendor(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`vendors/${id}`), {
    onSuccess: (res, id) => {
      // Invalidate specific vendor.
      queryClient.invalidateQueries([t.VENDOR, id]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Creates a new vendor.
 */
export function useCreateVendor(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('vendors', values), {
    onSuccess: () => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Retrieve vendor details.
 */
export function useVendor(id, props) {
  const apiRequest = useApiRequest();

  return useQuery([t.VENDOR, id], () => apiRequest.get(`vendors/${id}`), {
    select: (res) => res.data.vendor,
    initialDataUpdatedAt: 0,
    initialData: {
      data: { vendor: {} },
    },
    ...props,
  });
}
