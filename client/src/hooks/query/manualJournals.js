import { defaultTo } from 'lodash';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { transformPagination } from 'utils';
import useApiRequest from '../useRequest';

/**
 * Creates a new manual journal.
 */
export function useCreateJournal(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (values) => apiRequest.post('manual-journals', values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('JOURNALS');
      },
      ...props
    },
  );
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
        queryClient.invalidateQueries('JOURNALS');
        queryClient.invalidateQueries('JOURNAL', id);
      },
      ...props
    },
  );
}

/**
 * Deletes the given manual jouranl.
 */
export function useDeleteJournal(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.delete(`manual-journals/${id}`),
    {
      onSuccess: (res, id) => {
        queryClient.invalidateQueries('JOURNALS');
        queryClient.invalidateQueries('JOURNAL', id);
      },
      ...props
    },
  );
}

/**
 * Publishes the given manual journal.
 */
export function usePublishJournal(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.post(`manual-journals/${id}/publish`),
    {
      onSuccess: (res, id) => {
        queryClient.invalidateQueries('JOURNALS');
        queryClient.invalidateQueries('JOURNAL', id);
      },
      ...props
    },
  );
}

/**
 * Retrieve the manual journals with pagination meta.
 */
export function useJournals(query, props) {
  const apiRequest = useApiRequest();

  const states = useQuery(
    ['JOURNALS', query],
    () => apiRequest.get('manual-journals', { params: query }),
    {
      select: (response) => ({
        manualJournals: response.data.manual_journals,
        pagination: transformPagination(response.data.pagination),
        filterMeta: response.data.filter_meta
      }),
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {
      manualJournals: [],
      pagination: {},
      filterMeta: {},
    }),
  };
}

/**
 * Retrieve the manual journal details.
 */
export function useJournal(id, props) {
  const apiRequest = useApiRequest();

  return useQuery(
    ['JOURNAL', id],
    () => apiRequest.get(`manual-journals/${id}`),
    {
      select: (res) => res.data.manual_journal,
      ...props,
    },
  );
}
