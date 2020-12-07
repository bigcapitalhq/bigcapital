import { omit, flatten } from 'lodash';
import ApiService from 'services/ApiService';
import t from 'store/types';

export const makeJournalEntries = ({ form }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.post('manual-journals', form)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          const { response } = error;
          const { data } = response;

          reject(data?.errors);
        });
    });
};

export const fetchManualJournal = ({ id }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.get(`manual-journals/${id}`)
        .then((response) => {
          dispatch({
            type: t.MANUAL_JOURNAL_SET,
            payload: {
              id,
              manualJournal: response.data.manualJournal,
            },
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};

export const editManualJournal = ({ form, id }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.post(`manual-journals/${id}`, form)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          const { response } = error;
          const { data } = response;

          reject(data?.errors);
        });
    });
};
export const deleteManualJournal = ({ id }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.delete(`manual-journals/${id}`)
        .then((response) => {
          dispatch({
            type: t.MANUAL_JOURNAL_REMOVE,
            payload: { id },
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};

export const deleteBulkManualJournals = ({ ids }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.delete('manual-journals', { params: { ids } })
        .then((response) => {
          dispatch({
            type: t.MANUAL_JOURNALS_BULK_DELETE,
            payload: { ids },
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error.response.data.errors || []);
        });
    });
};

export const publishManualJournal = ({ id }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.post(`manual-journals/${id}/publish`)
        .then((response) => {
          dispatch({
            type: t.MANUAL_JOURNAL_PUBLISH,
            payload: { id },
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};

export const fetchManualJournalsTable = ({ query } = {}) => {
  return (dispatch, getState) =>
    new Promise((resolve, reject) => {
      let pageQuery = getState().manualJournals.tableQuery;

      if (pageQuery.filter_roles) {
        pageQuery = {
          ...omit(pageQuery, ['filter_roles']),
          stringified_filter_roles:
            JSON.stringify(pageQuery.filter_roles) || '',
        };
      }
      dispatch({
        type: t.MANUAL_JOURNALS_TABLE_LOADING,
        loading: true,
      });
      ApiService.get('manual-journals', {
        params: { ...pageQuery, ...query },
      })
        .then((response) => {
          dispatch({
            type: t.MANUAL_JOURNALS_PAGE_SET,
            payload: {
              manualJournals: response.data.manual_journals,
              customViewId:
              response.data?.filter_meta?.view?.custom_view_id || -1,
              pagination: response.data.pagination,
            },
          });
          dispatch({
            type: t.MANUAL_JOURNALS_ITEMS_SET,
            manual_journals: [
              ...response.data.manual_journals.map((manualJournal) => ({
                ...manualJournal,
                entries: manualJournal.entries.map((entry) => ({
                  ...omit(entry, ['account']),
                })),
              })),
            ],
          });
          dispatch({
            type: t.MANUAL_JOURNALS_PAGINATION_SET,
            payload: {
              pagination: response.data.pagination,
              customViewId:
                response.data?.filter_meta?.view?.custom_view_id || -1,
            },
          });
          dispatch({
            type: t.ACCOUNTS_ITEMS_SET,
            accounts: flatten(
              response.data.manual_journals?.map((journal) =>
                journal?.entries.map((entry) => entry.account),
              ),
            ),
          });
          dispatch({
            type: t.MANUAL_JOURNALS_TABLE_LOADING,
            loading: false,
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};
