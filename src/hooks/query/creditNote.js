import { useQueryClient, useMutation } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import { transformPagination } from 'utils';
import useApiRequest from '../useRequest';
import t from './types';

const commonInvalidateQueries = (queryClient) => {
  // Invalidate credit note.
  queryClient.invalidateQueries(t.CREDIT_NOTES);
  queryClient.invalidateQueries(t.CREDIT_NOTE);

  // Invalidate items.
  queryClient.invalidateQueries(t.ITEMS);
  queryClient.invalidateQueries(t.ITEM);

  // Invalidate customers.
  queryClient.invalidateQueries([t.CUSTOMER]);
  queryClient.invalidateQueries(t.CUSTOMERS);

  // Invalidate accounts.
  queryClient.invalidateQueries(t.ACCOUNTS);
  queryClient.invalidateQueries(t.ACCOUNT);

  // Invalidate settings.
  queryClient.invalidateQueries([t.SETTING, t.SETTING_CREDIT_NOTES]);

  // Invalidate financial reports.
  queryClient.invalidateQueries(t.FINANCIAL_REPORT);
};

/**
 * Create a new credit note.
 */
export function useCreateCreditNote(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (values) => apiRequest.post('sales/credit_notes', values),
    {
      onSuccess: (res, values) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Edit the given credit note.
 */
export function useEditCreditNote(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`sales/credit_notes/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);

        // Invalidate credit note query.
        queryClient.invalidateQueries([t.CREDIT_NOTE, id]);
      },
      ...props,
    },
  );
}

/**
 * Delete the given credit note.
 */
export function useDeleteCreditNote(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`sales/credit_notes/${id}`), {
    onSuccess: (res, id) => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);

      // Invalidate vendor credit query.
      queryClient.invalidateQueries([t.CREDIT_NOTE, id]);
    },
    ...props,
  });
}

const transformInvoices = (res) => ({
  creditNotes: res.data.credit_notes,
  pagination: transformPagination(res.data.pagination),
  filterMeta: res.data.filter_meta,
});

/**
 * Retrieve credit notes list with pagination meta.
 */
export function useCreditNotes(query, props) {
  return useRequestQuery(
    [t.CREDIT_NOTES, query],
    { method: 'get', url: 'sales/credit_notes', params: query },
    {
      select: transformInvoices,
      defaultData: {
        creditNotes: [],
        pagination: {
          page: 1,
          pageSize: 20,
          total: 0,
        },
        filterMeta: {},
      },
      ...props,
    },
  );
}

// export function useCreditNotes(query, props) {
//   return useRequestQuery(
//     [t.CREDIT_NOTES],
//     {
//       method: 'get',
//       url: 'sales/credit_notes',
//       params: query,
//     },
//     {
//       select: transformVendorCreditsResponse,
//       defaultData: {
//         credit_notes: {},
//         pagination: {
//           page: 1,
//           page_size: 12,
//           total: 0,
//         },
//         filterMeta: {},
//       },
//       ...props,
//     },
//   );
// }

/**
 * Retrieve credit note detail of the given id.
 * @param {number} id
 *
 */
export function useCreditNote(id, props, requestProps) {
  return useRequestQuery(
    [t.CREDIT_NOTE, id],
    { method: 'get', url: `sales/credit_notes/${id}`, ...requestProps },
    {
      select: (res) => res.data.credit_note,
      defaultData: {},
      ...props,
    },
  );
}

export function useRefreshCreditNotes() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries(t.CREDIT_NOTES);
    },
  };
}
