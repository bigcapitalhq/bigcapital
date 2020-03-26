import ApiService from 'services/ApiService';
import t from 'store/types';

export const fetchAccountTypes = () => {
  return (dispatch, getState) =>
    new Promise((resolve, reject) => {
      ApiService.get('account_types')
        .then(response => {
          dispatch({
            type: t.ACCOUNT_TYPES_LIST_SET,
            account_types: response.data.account_types
          });
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
};

export const fetchAccountsList = ({ query } = {}) => {
  return dispatch =>
    new Promise((resolve, reject) => {
      ApiService.get('accounts', { params: query })
        .then(response => {
          dispatch({
            type: t.ACCOUNTS_PAGE_SET,
            accounts: response.data.accounts,
            customViewId: response.data.customViewId
          });
          dispatch({
            type: t.ACCOUNTS_ITEMS_SET,
            accounts: response.data.accounts
          });
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
};

export const fetchAccountsDataTable = ({ query }) => {
  return dispatch =>
    new Promise((resolve, reject) => {
      ApiService.get('accounts')
        .then(response => {
          dispatch({
            type: t.ACCOUNTS_DATA_TABLE,
            data: response.data
          });
        })
        .catch(error => {
          reject(error);
        });
    });
};

export const submitAccount = ({ form }) => {
  return dispatch =>
    new Promise((resolve, reject) => {
      ApiService.post('accounts', form)
        .then(response => {
          dispatch({ type: t.CLEAR_ACCOUNT_FORM_ERRORS });
          resolve(response);
        })
        .catch(error => {
          const { response } = error;
          const { data } = response;
          const { errors } = data;

          dispatch({ type: t.CLEAR_ACCOUNT_FORM_ERRORS });
          if (errors) {
            dispatch({ type: t.ACCOUNT_FORM_ERRORS, errors });
          }
          reject(error);
        });
    });
};

export const editAccount = ({ id, form }) => {
  return dispatch =>
    new Promise((resolve, reject) => {
      ApiService.post(`accounts/${id}`, form)
        .then(response => {
          dispatch({ type: t.CLEAR_ACCOUNT_FORM_ERRORS });
          resolve(response);
        })
        .catch(error => {
          const { response } = error;
          const { data } = response;
          const { errors } = data;

          dispatch({ type: t.CLEAR_ACCOUNT_FORM_ERRORS });
          if (errors) {
            dispatch({ type: t.ACCOUNT_FORM_ERRORS, errors });
          }
          reject(error);
        });
    });
};

export const activeAccount = ({ id }) => {
  return dispatch => ApiService.post(`accounts/${id}/active`);
};

export const inactiveAccount = ({ id }) => {
  return dispatch => ApiService.post(`accounts/${id}/inactive`);
};

export const deleteAccount = ({ id }) => {
  return dispatch => ApiService.delete(`accounts/${id}`);
};

export const deleteBulkAccounts = ({ ids }) => {};

export const fetchAccount = ({ id }) => {
  return dispatch =>
    new Promise((resolve, reject) => {
      ApiService.get(`accounts/${id}`)
        .then(response => {
          dispatch({
            type: t.ACCOUNT_SET,
            account: response.data.account
          });
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
};
