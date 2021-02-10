import { useMutation, useQuery, useQueryClient } from 'react-query';
import { defaultTo } from 'lodash';
import ApiService from 'services/ApiService';
import { transformPagination } from 'utils';

const defaultPagination = {
  pageSize: 12,
  page: 0,
  pagesCount: 0,
};

/**
 * Retrieve customers list with pagination meta.
 */
export function useCustomers(query, props) {
  const states = useQuery(
    ['CUSTOMERS', query],
    () => ApiService.get(`customers`, { params: query }),
    {
      select: (response) => ({
        customers: response.data.customers,
        pagination: transformPagination(response.data.pagination),
        filterMeta: response.data.filter_meta
      }),
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {
      customers: [],
      pagination: defaultPagination,
      filterMeta: {},
    })
  }
}

/**
 * Edits the given customer details.
 * @param {*} props
 */
export function useEditCustomer(props) {
  const queryClient = useQueryClient();

  return useMutation(
    ([id, values]) => ApiService.post(`customers/${id}`, values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('CUSTOMERS');
        queryClient.invalidateQueries('CUSTOMER');
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

  return useMutation(
    (id) => ApiService.delete(`customers/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('CUSTOMERS');
        queryClient.invalidateQueries('CUSTOMER');
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

  return useMutation(
    (values) => ApiService.post('customers', values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('CUSTOMERS');
        queryClient.invalidateQueries('CUSTOMER');
      },
      ...props
    });
}

/**
 * Retrieve the customer details.
 */
export function useCustomer(id, props) {
  return useQuery(
    ['CUSTOMER', id],
    () => ApiService.get(`customers/${id}`),
    {
      select: (res) => res.data.customer,
      ...props
    },
  );
}
