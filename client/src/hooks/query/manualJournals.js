import { useMutation, useQuery } from 'react-query';
import ApiService from 'services/ApiService';

// Transform joiurn
const transformJournals = (response) => {
  return {
    manualJournals: response.data.manual_journals,
    pagination: response.data.pagination,
  };
};

/**
 * Creates a new manual journal.
 */
export function useCreateJournal(props) {
  return useMutation(
    (values) => ApiService.post('manual-journals', values),
    props,
  );
}

/**
 * Edits the given manual journal.
 */
export function useEditJournal(props) {
  return useMutation(
    (values, id) => ApiService.post(`manual-journals/${id}`, values),
    props,
  );
}

/**
 * Deletes the given manual jouranl.
 */
export function useDeleteJournal(props) {
  return useMutation(
    (values, id) => ApiService.delete(`manual-journals/${id}`),
    props,
  );
}

/**
 * Publishes the given manual journal.
 */
export function usePublishJournal(props) {
  return useMutation(
    (id) => ApiService.post(`manual-journals/${id}/publish`),
    props,
  );
}

/**
 * Retrieve the manual journals with pagination meta.
 */
export function useJournals(query, props) {
  return useQuery(
    ['JOURNALS', query],
    () =>
      ApiService.get('manual-journals', { params: query }).then(
        transformJournals,
      ),
    {
      initialData: {
        manualJournals: [],
        pagination: {},
      },
      ...props,
    },
  );
}

/**
 * Retrieve the manual journal details.
 */
export function useJournal(id, props) {
  return useQuery(
    ['JOURNAL', id],
    async () => {
      const { data } = await ApiService.get(`manual-journals/${id}`);

      return data.manual_journal;
    },
    {
      ...props,
    },
  );
}
