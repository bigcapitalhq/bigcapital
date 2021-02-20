import { useMutation, useQuery, useQueryClient } from 'react-query';
import { defaultTo } from 'lodash';
import { transformPagination } from 'utils';
import useApiRequest from '../useRequest';

/**
 * Retrieve vendors list.
 */
export function useVendors(query, props) {
  const apiRequest = useApiRequest();

  const states = useQuery(
    ['VENDORS', query],
    () => apiRequest.get(`vendors`, { params: query }),
    {
      select: (res) => ({
        vendors: res.data.vendors,
        pagination: transformPagination(res.data.pagination),
        filterMeta: res.data.filter_meta,
      }),
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {
      vendors: [],
      pagination: {},
      filterMeta: {}
    }),
  };
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
      onSuccess: () => {
        queryClient.invalidateQueries('VENDORS');
        queryClient.invalidateQueries('VENDOR');
      },
      ...props
    },
  );
}

/**
 * Deletes the given vendor.
 */
export function useDeleteVendor(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.delete(`vendors/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('VENDORS');
        queryClient.invalidateQueries('VENDOR');
      },
      ...props
    });
}

/**
 * Creates a new vendor.
 */
export function useCreateVendor(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (values) => apiRequest.post('vendors', values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('VENDORS');
      },
      ...props
    }
  );
}

/**
 * Retrieve vendor details.
 */
export function useVendor(id, props) {
  const apiRequest = useApiRequest();

  return useQuery(
    ['VENDOR', id],
    () => apiRequest.get(`vendors/${id}`),
    {
      select: (res) => res.data.vendor,
      ...props
    },
  );
}
