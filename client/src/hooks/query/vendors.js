import { useMutation, useQuery, useQueryClient } from 'react-query';
import { defaultTo } from 'lodash';
import ApiService from 'services/ApiService';
import { transformPagination } from 'utils';

/**
 * Retrieve vendors list.
 */
export function useVendors(query, props) {
  const states = useQuery(
    ['VENDORS', query],
    () => ApiService.get(`vendors`, { params: query }),
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

  return useMutation(
    ([id, values]) => ApiService.post(`vendors/${id}`, values),
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

  return useMutation(
    (id) => ApiService.delete(`vendors/${id}`),
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

  return useMutation(
    (values) => ApiService.post('vendors', values),
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
  return useQuery(
    ['VENDOR', id],
    () => ApiService.get(`vendors/${id}`),
    {
      select: (res) => res.data.vendor,
      ...props
    },
  );
}
