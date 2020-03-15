import ApiService from 'services/ApiService';
import t from 'store/types';

export const makeJournalEntries = ({ form }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.post('accounting/make-journal-entries', form).then((response) => {
      resolve(response);
    }).catch((error) => { reject(error); });
  });
}