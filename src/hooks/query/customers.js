import { useMutation, useQueryClient } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import { transformPagination } from 'utils';
import useApiRequest from '../useRequest';
import t from './types';

const defaultPagination = {
  pageSize: 12,
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
    ([id, values]) => apiRequest.post(`customers/${id}`, values),
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
      select: (res) => res.data.customer,
      defaultData: {},
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
