// @ts-nocheck
import { useMutation, useQueryClient } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import { transformPagination, transformToCamelCase } from '@/utils';
import useApiRequest from '../useRequest';
import t from './types';

const defaultPagination = {
  pageSize: 20,
  page: 0,
  pagesCount: 0,
};

const commonInvalidateQueries = (queryClient) => {
  // Invalidate customers.
  queryClient.invalidateQueries(t.CUSTOMERS);

  // Invalidate the financial reports.
  queryClient.invalidateQueries(t.ACCOUNTS);
  queryClient.invalidateQueries(t.ACCOUNT);

  // Invalidate the financial reports.
  queryClient.invalidateQueries(t.FINANCIAL_REPORT);

  // Invalidate SMS details.
  queryClient.invalidateQueries(t.SALE_ESTIMATE_SMS_DETAIL);
  queryClient.invalidateQueries(t.SALE_INVOICE_SMS_DETAIL);
  queryClient.invalidateQueries(t.SALE_RECEIPT_SMS_DETAIL);
  queryClient.invalidateQueries(t.PAYMENT_RECEIVE_SMS_DETAIL);

  // Invalidate mutate base currency abilities.
  queryClient.invalidateQueries(t.ORGANIZATION_MUTATE_BASE_CURRENCY_ABILITIES);
};

// Customers response selector.
const customersSelector = (response) => ({
  customers: response.data.customers,
  pagination: transformPagination(response.data.pagination),
  filterMeta: response.data.filter_meta,
});

/**
 * Retrieve customers list with pagination meta.
 */
export function useCustomers(query, props) {
  return useRequestQuery(
    [t.CUSTOMERS, query],
    { method: 'get', url: `customers`, params: query },
    {
      select: customersSelector,
      defaultData: {
        customers: [],
        pagination: defaultPagination,
        filterMeta: {},
      },
      ...props,
    },
  );
}

/**
 * Edits the given customer details.
 * @param {*} props
 */
export function useEditCustomer(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.put(`customers/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Invalidate specific customer.
        queryClient.invalidateQueries([t.CUSTOMER, id]);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Deletes the given customer.
 */
export function useDeleteCustomer(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`customers/${id}`), {
    onSuccess: (res, id) => {
      // Invalidate specific customer.
      queryClient.invalidateQueries([t.CUSTOMER, id]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Deletes multiple customers in bulk.
 */
export function useBulkDeleteCustomers(props) {
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
      apiRequest.post('customers/bulk-delete', {
        ids,
        skip_undeletable: skipUndeletable,
      }).then((res) => transformToCamelCase(res.data)),
    {
      onSuccess: () => {
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Validates which customers can be deleted in bulk.
 */
export function useValidateBulkDeleteCustomers(props) {
  const apiRequest = useApiRequest();

  return useMutation(
    (ids: number[]) =>
      apiRequest.post('customers/validate-bulk-delete', { ids }).then((res) => transformToCamelCase(res.data)),
    {
      ...props,
    },
  );
}

/**
 * Creates a new customer.
 */
export function useCreateCustomer(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('customers', values), {
    onSuccess: () => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Retrieve the customer details.
 */
export function useCustomer(id, props) {
  return useRequestQuery(
    [t.CUSTOMER, id],
    { method: 'get', url: `customers/${id}` },
    {
      select: (res) => res.data,
      defaultData: {},
      ...props,
    },
  );
}

export function useEditCustomerOpeningBalance(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) =>
      apiRequest.post(`customers/${id}/opening_balance`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Invalidate specific customer.
        queryClient.invalidateQueries([t.CUSTOMER, id]);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

export function useRefreshCustomers() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries(t.CUSTOMERS);
    },
  };
}
