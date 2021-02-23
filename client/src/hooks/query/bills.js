import { useQueryClient, useQuery, useMutation } from 'react-query';
import { defaultTo } from 'lodash';
import { transformPagination } from 'utils';
import useApiRequest from '../useRequest';

/**
 * Creates a new sale invoice.
 */
export function useCreateBill(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('purchases/bills', values), {
    onSuccess: (res, values) => {
      queryClient.invalidateQueries('BILLS');
      queryClient.invalidateQueries('BILL');
      queryClient.invalidateQueries(['VENDORS']);
      queryClient.invalidateQueries(['VENDOR', values.vendor_id]);
    },
    ...props,
  });
}

/**
 * Edits the given sale invoice.
 */
export function useEditBill(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`purchases/bills/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        queryClient.invalidateQueries('BILLS');
        queryClient.invalidateQueries('BILL');
        queryClient.invalidateQueries(['VENDORS']);
        queryClient.invalidateQueries(['VENDOR', values.vendor_id]);
      },
      ...props,
    },
  );
}

/**
 * Deletes the given sale invoice.
 */
export function useDeleteBill(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`purchases/bills/${id}`), {
    onSuccess: (res, id) => {
      queryClient.invalidateQueries('BILLS');
      queryClient.invalidateQueries('BILL');
      queryClient.invalidateQueries(['VENDORS']);
    },
    ...props,
  });
}

/**
 * Retrieve sale invoices list with pagination meta.
 */
export function useBills(query, props) {
  const apiRequest = useApiRequest();

  const states = useQuery(
    ['BILLS', query],
    () =>
      apiRequest.get('purchases/bills', { params: query }),
    {
      select: (response) => ({
        bills: response.data.bills,
        pagination: transformPagination(response.data.pagination),
        filterMeta: response.data.filter_meta,
      }),
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {
      bills: [],
      pagination: {
        page: 1,
        page_size: 12,
        total: 0,
      },
      filterMeta: {},
    })
  }
}

/**
 * Retrieve bill details of the given bill id.
 * @param {number} id - Bill id.
 */
export function useBill(id, props) {
  const apiRequest = useApiRequest();

  const states = useQuery(
    ['BILL', id],
    () => apiRequest.get(`/purchases/bills/${id}`),
    {
      select: (res) => res.data.bill,
      ...props,
    }
  );

  return {
    ...states,
    data: defaultTo(states.data, {}),
  }
}

/**
 * Marks the given bill as open.
 */
export function useOpenBill(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.delete(`purchases/bills/${id}/open`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('BILLS');
        queryClient.invalidateQueries(['VENDORS']);
      },
      ...props,
    },
  );
}

/**
 * Retrieve the due bills of the given vendor id.
 * @param {number} vendorId -
 */
export function useDueBills(vendorId, props) {
  const apiRequest = useApiRequest();

  const states = useQuery(
    ['BILLS_DUE', vendorId],
    () =>
      apiRequest.get(`purchases/bills/due`, {
        params: { vendor_id: vendorId },
      }),
    {
      select: (res) => res.data.bills,
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, []),
  };
}
