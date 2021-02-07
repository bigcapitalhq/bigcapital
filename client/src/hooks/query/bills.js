import { useQueryClient, useQuery, useMutation } from 'react-query';
import ApiService from 'services/ApiService';

// Bills transformer.
const billsTransformer = (response) => {
  return {
    bills: response.data.bills,
    pagination: response.data.pagination,
    filterMeta: response.data.filter_meta,
  };
};

/**
 * Creates a new sale invoice.
 */
export function useCreateBill(props) {
  const queryClient = useQueryClient();

  return useMutation((values) => ApiService.post('purchases/bills', values), {
    onSuccess: () => {
      queryClient.invalidateQueries('BILLS');
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
    (id, values) => ApiService.post(`purchases/bills/${id}`, values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('BILLS');
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
    },
    ...props,
  });
}

/**
 * Retrieve sale invoices list with pagination meta.
 */
export function useBills(query, props) {
  return useQuery(
    ['BILLS', query],
    () =>
      ApiService.get('purchases/bills', { params: query }).then(
        billsTransformer,
      ),
    {
      initialData: {
        bills: [],
        pagination: {
          page: 1,
          page_size: 12,
          total: 0,
        },
      },
      ...props,
    },
  );
}

/**
 * Retrieve bill details of the given bill id.
 * @param {number} id - Bill id.
 */
export function useBill(id, props) {
  return useQuery(
    ['BILL', id],
    async () => {
      const { data } = await ApiService.get(`/purchases/bills/${id}`);
      return data.bill;
    },
    {
      initialData: {},
      ...props,
    },
  );
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
