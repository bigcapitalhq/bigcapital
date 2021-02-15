import { defaultTo } from 'lodash';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import ApiService from 'services/ApiService';
import { transformPagination } from 'utils';

/**
 * Creates a new manual journal.
 */
export function useCreateJournal(props) {
  const queryClient = useQueryClient();

  return useMutation(
    (values) => ApiService.post('manual-journals', values),
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

  return useMutation(
    ([id, values]) => ApiService.post(`manual-journals/${id}`, values),
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

  return useMutation(
    (id) => ApiService.delete(`manual-journals/${id}`),
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

  return useMutation(
    (id) => ApiService.post(`manual-journals/${id}/publish`),
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
  const states = useQuery(
    ['JOURNALS', query],
    () => ApiService.get('manual-journals', { params: query }),
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
  return useQuery(
    ['JOURNAL', id],
    () => ApiService.get(`manual-journals/${id}`),
    {
      select: (res) => res.data.manual_journal,
      ...props,
    },
  );
}
