import { defaultTo } from 'lodash';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { transformPagination } from 'utils';
import useApiRequest from '../useRequest';
import t from './types';


const commonInvalidateQueries = (client) => {
  // Invalidate payment mades.
  client.invalidateQueries(t.PAYMENT_MADES);
        
  // Invalidate payment made new entries.
  client.invalidateQueries(t.PAYMENT_MADE_NEW_ENTRIES);
  client.invalidateQueries(t.PAYMENT_MADE_EDIT_PAGE);

  // Invalidate financial reports.
  client.invalidateQueries(t.FINANCIAL_REPORT);

  // Invalidate accounts.
  client.invalidateQueries(t.ACCOUNTS);
  client.invalidateQueries(t.ACCOUNT);

  // Invalidate bills.
  client.invalidateQueries(t.BILLS);
  client.invalidateQueries(t.BILL);

  // Invalidate vendors.
  client.invalidateQueries(t.VENDORS);
  client.invalidateQueries(t.VENDOR);
};

/**
 * Retrieve payment mades list.
 */
export function usePaymentMades(query, props) {
  const apiRequest = useApiRequest();

  const states = useQuery(
    [t.PAYMENT_MADES, query],
    () => apiRequest.get('purchases/bill_payments', { params: query }),
    {
      select: (res) => ({
        paymentMades: res.data.bill_payments,
        pagination: transformPagination(res.data.pagination),
        filterMeta: res.data.filter_meta,
      }),
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {
      paymentMades: [],
      pagination: {},
      filterMeta: {},
    }),
  };
}

/**
 * Creates payment made.
 */
export function useCreatePaymentMade(props) {
  const client = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (values) => apiRequest.post('purchases/bill_payments', values),
    {
      onSuccess: (res, values) => {
        // Common invalidation queries.
        commonInvalidateQueries(client);
      },
      ...props,
    },
  );
}

/**
 * Edits payment made.
 */
export function useEditPaymentMade(props) {
  const client = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`purchases/bill_payments/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Common invalidation queries.
        commonInvalidateQueries(client);

        // Invalidate specific payment made.
        client.invalidateQueries([t.PAYMENT_MADE, id]);
      },
      ...props,
    },
  );
}

/**
 * Deletes payment made.
 */
export function useDeletePaymentMade(props) {
  const client = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.delete(`purchases/bill_payments/${id}`),
    {
      onSuccess: (res, id) => {
        // Common invalidation queries.
        commonInvalidateQueries(client);

        // Invalidate specific payment made.
        client.invalidateQueries([t.PAYMENT_MADE, id]);
      },
      ...props,
    },
  );
}

/**
 * Retrieve specific payment made.
 */
export function usePaymentMadeEditPage(id, props) {
  const apiRequest = useApiRequest();

  const states = useQuery(
    [t.PAYMENT_MADE_EDIT_PAGE, id],
    () => apiRequest.get(`purchases/bill_payments/${id}/edit-page`),
    {
      select: (res) => ({
        paymentMade: res.data.bill_payment,
        entries: res.data.entries,
      }),
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {}),
  };
}

/**
 * Retreive payment made new page entries.
 * @param {number} vendorId -
 */
export function usePaymentMadeNewPageEntries(vendorId, props) {
  const apiRequest = useApiRequest();

  return useQuery(
    [t.PAYMENT_MADE_NEW_ENTRIES, vendorId],
    () =>
      apiRequest.get(`purchases/bill_payments/new-page/entries`, {
        params: { vendor_id: vendorId },
      }),
    {
      select: (res) => res.data.entries,
      initialDataUpdatedAt: 0,
      initialData: {
        data: {
          entries: [],
        },
      },
      ...props,
    },
  );
}
