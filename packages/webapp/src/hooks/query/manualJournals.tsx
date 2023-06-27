// @ts-nocheck
import { useMutation, useQueryClient } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import { transformPagination } from '@/utils';
import useApiRequest from '../useRequest';
import t from './types';

const commonInvalidateQueries = (client) => {
  // Invalidate manual journals.
  client.invalidateQueries(t.MANUAL_JOURNALS);

  // Invalidate customers.
  client.invalidateQueries(t.CUSTOMERS);
  client.invalidateQueries(t.CUSTOMER);

  // Invalidate vendors.
  client.invalidateQueries(t.VENDORS);
  client.invalidateQueries(t.VENDOR);

  // Invalidate accounts.
  client.invalidateQueries(t.ACCOUNTS);
  client.invalidateQueries(t.ACCOUNT);

  // Invalidate settings.
  client.invalidateQueries([t.SETTING, t.SETTING_MANUAL_JOURNALS]);

  // Invalidate financial reports.
  client.invalidateQueries(t.FINANCIAL_REPORT);

  // Invalidate the cashflow transactions.
  client.invalidateQueries(t.CASH_FLOW_TRANSACTIONS);
  client.invalidateQueries(t.CASHFLOW_ACCOUNT_TRANSACTIONS_INFINITY);
};

/**
 * Creates a new manual journal.
 */
export function useCreateJournal(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('manual-journals', values), {
    onSuccess: () => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Edits the given manual journal.
 */
export function useEditJournal(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`manual-journals/${id}`, values),
    {
      onSuccess: (res, [id]) => {
        // Invalidate specific manual journal.
        queryClient.invalidateQueries(t.MANUAL_JOURNAL, id);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Deletes the given manual journal.
 */
export function useDeleteJournal(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`manual-journals/${id}`), {
    onSuccess: (res, id) => {
      // Invalidate specific manual journal.
      queryClient.invalidateQueries(t.MANUAL_JOURNAL, id);

      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Publishes the given manual journal.
 */
export function usePublishJournal(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`manual-journals/${id}/publish`), {
    onSuccess: (res, id) => {
      // Invalidate specific manual journal.
      queryClient.invalidateQueries(t.MANUAL_JOURNAL, id);

      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

const transformJournals = (response) => ({
  manualJournals: response.data.manual_journals,
  pagination: transformPagination(response.data.pagination),
  filterMeta: response.data.filter_meta,
});

/**
 * Retrieve the manual journals with pagination meta.
 */
export function useJournals(query, props) {
  return useRequestQuery(
    [t.MANUAL_JOURNALS, query],
    { method: 'get', url: 'manual-journals', params: query },
    {
      select: transformJournals,
      defaultData: {
        manualJournals: [],
        pagination: {},
        filterMeta: {},
      },
      ...props,
    },
  );
}

/**
 * Retrieve the manual journal details.
 */
export function useJournal(id, props) {
  return useRequestQuery(
    [t.MANUAL_JOURNAL, id],
    { method: 'get', url: `manual-journals/${id}` },
    {
      select: (res) => res.data.manual_journal,
      defaultData: {},
      ...props,
    },
  );
}

export function useRefreshJournals() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries(t.MANUAL_JOURNALS);
    },
  };
}
