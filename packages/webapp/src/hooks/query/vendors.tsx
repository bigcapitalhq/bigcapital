// @ts-nocheck
import { useMutation, useQueryClient } from 'react-query';
import t from './types';
import { transformPagination, transformToCamelCase } from '@/utils';
import useApiRequest from '../useRequest';
import { useRequestQuery } from '../useQueryRequest';

// Common invalidate queries.
const commonInvalidateQueries = (queryClient) => {
  // Invalidate vendors list.
  queryClient.invalidateQueries(t.VENDORS);

  // Invalidate financial reports.
  queryClient.invalidateQueries(t.ACCOUNTS);
  queryClient.invalidateQueries(t.ACCOUNT);

  // Invalidate financial reports.
  queryClient.invalidateQueries(t.FINANCIAL_REPORT);

  // Invalidate mutate base currency abilities.
  queryClient.invalidateQueries(t.ORGANIZATION_MUTATE_BASE_CURRENCY_ABILITIES);
};

// Transformes vendors response.
const transformVendorsResponse = (res) => ({
  vendors: res.data.vendors,
  pagination: transformPagination(res.data.pagination),
  filterMeta: res.data.filter_meta,
});

/**
 * Retrieve vendors list.
 */
export function useVendors(query, props) {
  return useRequestQuery(
    [t.VENDORS, query],
    { method: 'get', url: `vendors`, params: query },
    {
      select: transformVendorsResponse,
      defaultData: {
        vendors: [],
        pagination: {},
        filterMeta: {},
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
    ([id, values]) => apiRequest.put(`vendors/${id}`, values),
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
 * Deletes multiple vendors in bulk.
 */
export function useBulkDeleteVendors(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ({
      ids,
      skipUndeletable = false,
    }: {
      ids: number[];
      skipUndeletable?: boolean;
    }) =>
      apiRequest.post('vendors/bulk-delete', {
        ids,
        skip_undeletable: skipUndeletable,
      }),
    {
      onSuccess: () => {
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Validates which vendors can be deleted in bulk.
 */
export function useValidateBulkDeleteVendors(props) {
  const apiRequest = useApiRequest();

  return useMutation(
    (ids: number[]) =>
      apiRequest.post('vendors/validate-bulk-delete', { ids }).then((res) => transformToCamelCase(res.data)),
    {
      ...props,
    },
  );
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
  return useRequestQuery(
    [t.VENDOR, id],
    { method: 'get', url: `vendors/${id}` },
    {
      select: (res) => res.data,
      defaultData: {},
      ...props,
    },
  );
}

export function useEditVendorOpeningBalance(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`vendors/${id}/opening_balance`, values),
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

export function useRefreshVendors() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries(t.VENDORS);
    },
  };
}
