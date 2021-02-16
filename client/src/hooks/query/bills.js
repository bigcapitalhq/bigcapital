import { useQueryClient, useQuery, useMutation } from 'react-query';
import { defaultTo } from 'lodash';
import ApiService from 'services/ApiService';
import { transformPagination } from 'utils';

/**
 * Creates a new sale invoice.
 */
export function useCreateBill(props) {
  const queryClient = useQueryClient();

  return useMutation((values) => ApiService.post('purchases/bills', values), {
    onSuccess: () => {
      queryClient.invalidateQueries('BILLS');
      queryClient.invalidateQueries('BILL');
    },
    ...props,
  });
}

/**
 * Edits the given sale invoice.
 */
export function useEditBill(props) {
  const queryClient = useQueryClient();

  return useMutation(
    ([id, values]) => ApiService.post(`purchases/bills/${id}`, values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('BILLS');
        queryClient.invalidateQueries('BILL');
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

  return useMutation((id) => ApiService.delete(`purchases/bills/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries('BILLS');
      queryClient.invalidateQueries('BILL');
    },
    ...props,
  });
}

/**
 * Retrieve sale invoices list with pagination meta.
 */
export function useBills(query, props) {
  const states = useQuery(
    ['BILLS', query],
    () =>
      ApiService.get('purchases/bills', { params: query }),
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
  const states = useQuery(
    ['BILL', id],
    () => ApiService.get(`/purchases/bills/${id}`),
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

  return useMutation(
    (id) => ApiService.delete(`purchases/bills/${id}/open`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('BILLS');
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
  const states = useQuery(
    ['BILLS_DUE', vendorId],
    () =>
      ApiService.get(`purchases/bills/due`, {
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
