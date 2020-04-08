import ApiService from 'services/ApiService';
import t from 'store/types';

export const makeJournalEntries = ({ form }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.post('accounting/make-journal-entries', form)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};

export const deleteManualJournal = ({ id }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.delete(`accounting/manual-journals/${id}`)
        .then((response) => {
          dispatch({
            type: t.MANUAL_JOURNAL_DELETE,
            id,
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
      const pageQuery = getState().manual_journals.tableQuery;

      dispatch({
        type: t.MANUAL_JOURNALS_TABLE_LOADING,
        loading: true,
      });
      ApiService.get('accounting/manual-journals', {
        params: { ...pageQuery, ...query },
      })
        .then((response) => {
          
          dispatch({
            type: t.MANUAL_JOURNALS_PAGE_SET,
            manual_journals: response.data.manualJournals,
            customViewId: response.data.customViewId,
          });
          dispatch({
            type: t.MANUAL_JOURNALS_ITEMS_SET,
            manual_journals: response.data.manualJournals,
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

export const fetchManualJournalsDataTable = ({ query }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.get('accounting/manual-journals')
        .then((response) => {
          dispatch({
            type: t.MANUAL_JOURNALS_DATA_TABLE,
            data: response.data,
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
};
