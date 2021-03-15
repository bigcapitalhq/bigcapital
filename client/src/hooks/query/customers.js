import { useMutation, useQueryClient } from 'react-query';
import { useQueryTenant } from '../useQueryTenant';
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

/**
 * Retrieve customers list with pagination meta.
 */
export function useCustomers(query, props) {
  const apiRequest = useApiRequest();

  return useQueryTenant(
    [t.CUSTOMERS, query],
    () => apiRequest.get(`customers`, { params: query }),
    {
      select: (response) => ({
        customers: response.data.customers,
        pagination: transformPagination(response.data.pagination),
        filterMeta: response.data.filter_meta,
      }),
      initialDataUpdatedAt: 0,
      initialData: {  
        data: {
          customers: [],
          pagination: defaultPagination,
          filter_meta: {},
        }
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
      ...props
    },
  );
}

/**
 * Deletes the given customer.
 */
export function useDeleteCustomer(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.delete(`customers/${id}`),
    {
      onSuccess: (res, id) => {
        // Invalidate specific customer.
        queryClient.invalidateQueries([t.CUSTOMER, id]);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    }
  );
}

/**
 * Creates a new customer.
 */
export function useCreateCustomer(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (values) => apiRequest.post('customers', values),
    {
      onSuccess: () => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props
    });
}

/**
 * Retrieve the customer details.
 */
export function useCustomer(id, props) {
  const apiRequest = useApiRequest();

  return useQueryTenant(
    [t.CUSTOMER, id],
    () => apiRequest.get(`customers/${id}`),
    {
      select: (res) => res.data.customer,
      initialDataUpdatedAt: 0,
      initialData: {
        data: {
          customer: {}
        }
      },
      ...props
    },
  );
}
