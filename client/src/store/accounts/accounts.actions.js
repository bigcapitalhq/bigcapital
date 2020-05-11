import { omit } from 'lodash';
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
        .catch(error => { reject(error); });
    });
};

export const fetchAccountsList = ({ query } = {}) => {
  return dispatch => new Promise((resolve, reject) => {
    dispatch({
      type: t.SET_DASHBOARD_REQUEST_LOADING,
    });
    ApiService.get('accounts', { params: query }).then(response => {
      dispatch({
        type: t.ACCOUNTS_PAGE_SET,
        accounts: response.data.accounts,
        customViewId: response.data.customViewId
      });
      dispatch({
        type: t.ACCOUNTS_ITEMS_SET,
        accounts: response.data.accounts
      });
      dispatch({
        type: t.SET_DASHBOARD_REQUEST_COMPLETED,
      });
      resolve(response);
    })
    .catch((error) => {
      dispatch({
        type: t.SET_DASHBOARD_REQUEST_COMPLETED,
      });
      reject(error);
    });
  });
};

export const fetchAccountsTable = ({ query } = {}) => {
  return (dispatch, getState) =>
    new Promise((resolve, reject) => {
      let pageQuery = getState().accounts.tableQuery;

      if (pageQuery.filter_roles) {
        pageQuery = {
          ...omit(pageQuery, ['filter_roles']),
          stringified_filter_roles: JSON.stringify(pageQuery.filter_roles) || '',
        };
      }
      dispatch({
        type: t.ACCOUNTS_TABLE_LOADING,
        loading: true,
      });
      dispatch({
        type: t.SET_DASHBOARD_REQUEST_LOADING,
      });
      ApiService.get('accounts', { params: { ...pageQuery, ...query } })
        .then((response) => {
          dispatch({
            type: t.ACCOUNTS_PAGE_SET,
            accounts: response.data.accounts,
            customViewId: response.data.customViewId
          });
          dispatch({
            type: t.ACCOUNTS_ITEMS_SET,
            accounts: response.data.accounts
          });
          dispatch({
            type: t.ACCOUNTS_TABLE_LOADING,
            loading: false,
          });
          dispatch({
            type: t.SET_DASHBOARD_REQUEST_COMPLETED,
          });
          resolve(response);
        })
        .catch((error) => {
          dispatch({
            type: t.SET_DASHBOARD_REQUEST_COMPLETED,
          });
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
      dispatch({
        type: t.SET_DASHBOARD_REQUEST_LOADING,
      });
      ApiService.post('accounts', form)
        .then(response => {
          dispatch({
            type: t.ACCOUNT_ERRORS_CLEAR,
          });
          dispatch({
            type: t.SET_DASHBOARD_REQUEST_COMPLETED,
          });
          resolve(response);
        })
        .catch(error => {
          const { response } = error;
          const { data } = response;
          const { errors } = data;

          dispatch({
            type: t.ACCOUNT_ERRORS_CLEAR,
          });
          if (errors) {
            dispatch({
              type: t.ACCOUNT_ERRORS_SET,
              payload: { errors },
            });
          }
          dispatch({
            type: t.SET_DASHBOARD_REQUEST_COMPLETED,
          });
          reject(errors);
        });
    });
};

export const editAccount = ({ id, form }) => {
  return dispatch => new Promise((resolve, reject) => {
    dispatch({
      type: t.SET_DASHBOARD_REQUEST_LOADING,
    });
    ApiService.post(`accounts/${id}`, form)
      .then(response => {
        dispatch({ type: t.CLEAR_ACCOUNT_FORM_ERRORS });
        dispatch({
          type: t.SET_DASHBOARD_REQUEST_COMPLETED,
        });
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
        dispatch({
          type: t.SET_DASHBOARD_REQUEST_COMPLETED,
        });
        reject(errors);
      });
  });
};

export const activateAccount = ({ id }) => {
  return dispatch => ApiService.post(`accounts/${id}/active`);
};

export const inactiveAccount = ({ id }) => {
  return dispatch => ApiService.post(`accounts/${id}/inactive`);
};

export const deleteAccount = ({ id }) => {
  return dispatch => new Promise((resolve, reject) => {
    ApiService.delete(`accounts/${id}`).then((response) => {
      dispatch({ type: t.ACCOUNT_DELETE, id });
      resolve(response);
    }).catch((error) => {
      reject(error.response.data.errors || []);
    });
  });
};

export const deleteBulkAccounts = ({ ids }) => {
  return dispatch => new Promise((resolve, reject) => {
    ApiService.delete(`accounts`, { params: { ids }}).then((response) => {
      dispatch({
        type: t.ACCOUNTS_BULK_DELETE,
        payload: { ids }
      });
      resolve(response);
    }).catch((error) => {
      const { response } = error;
      const { data } = response;
      const { errors } = data;

      reject(errors);
    });
  });
};

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
