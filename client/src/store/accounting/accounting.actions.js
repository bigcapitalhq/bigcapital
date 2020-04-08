import ApiService from 'services/ApiService';
import t from 'store/types';

export const makeJournalEntries = ({ form }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.post('accounting/make-journal-entries', form).then((response) => {
      resolve(response);
    }).catch((error) => { reject(error); });
  });
};

export const fetchManualJournal = ({ id }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.get(`accounting/manual-journals/${id}`).then((response) => {
      dispatch({
        type: t.MANUAL_JOURNAL_SET,
        payload: {
          id,
          manualJournal: response.data.manual_journal,
        }        
      });
      resolve(response);
    }).catch((error) => { reject(error); });
  });
};

export const editManualJournal = ({ form, id }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.post(`accounting/manual-journals/${id}`, form).then((response) => {
      resolve(response);
    }).catch((error) => { reject(error); });
  });
}