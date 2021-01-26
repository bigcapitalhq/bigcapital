import { batch } from 'react-redux'
import { omit } from 'lodash';
import ApiService from 'services/ApiService';
import t from 'store/types';

export const fetchAccountTypes = () => {
  return (dispatch, getState) =>
    new Promise((resolve, reject) => {
      ApiService.get('account_types')
        .then((response) => {
          dispatch({
            type: t.ACCOUNT_TYPES_LIST_SET,
            account_types: response.data.account_types,
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};

export const fetchAccountsList = () => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      const query = { column_sort_by: 'name', sort_order: 'asc' };

      ApiService.get('accounts', { params: query })
        .then((response) => {
          batch(() => {
            dispatch({
              type: t.ACCOUNTS_ITEMS_SET,
              accounts: response.data.accounts,
            });
            dispatch({
              type: t.ACCOUNTS_LIST_SET,
              payload: {
                accounts: response.data.accounts,
              }
            });
          });
          resolve(response);
        })
        .catch((error) => {
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
          stringified_filter_roles:
            JSON.stringify(pageQuery.filter_roles) || '',
        };
      }
      dispatch({
        type: t.ACCOUNTS_TABLE_LOADING,
        loading: true,
      });
      ApiService.get('accounts', { params: { ...pageQuery, ...query } })
        .then((response) => {
          batch(() => {
            dispatch({
              type: t.ACCOUNTS_PAGE_SET,
              accounts: response.data.accounts,
              customViewId: response.data?.filter_meta?.view?.custom_view_id,
            });
            dispatch({
              type: t.ACCOUNTS_ITEMS_SET,
              accounts: response.data.accounts,
            });
            dispatch({
              type: t.ACCOUNTS_TABLE_LOADING,
              loading: false,
            });
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};

export const fetchAccountsDataTable = ({ query }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.get('accounts')
        .then((response) => {
          dispatch({
            type: t.ACCOUNTS_DATA_TABLE,
            data: response.data,
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
};

export const submitAccount = ({ form }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.post('accounts', form)
        .then((response) => {
          dispatch({
            type: t.ACCOUNT_ERRORS_CLEAR,
          });
          resolve(response);
        })
        .catch((error) => {
          const { response } = error;
          const { data } = response;

          dispatch({
            type: t.ACCOUNT_ERRORS_CLEAR,
          });
          if (error) {
            dispatch({
              type: t.ACCOUNT_ERRORS_SET,
              payload: { error },
            });
          }
          reject(data?.errors);
        });
    });
};

export const editAccount = (id, form) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.post(`accounts/${id}`, form)
        .then((response) => {
          dispatch({ type: t.CLEAR_ACCOUNT_FORM_ERRORS });
          resolve(response);
        })
        .catch((error) => {
          const { response } = error;
          const { data } = response;

          dispatch({ type: t.CLEAR_ACCOUNT_FORM_ERRORS });
          if (error) {
            dispatch({ type: t.ACCOUNT_FORM_ERRORS, error });
          }
          reject(data?.errors);
        });
    });
};

export const activateAccount = ({ id }) => {
  return (dispatch) => ApiService.post(`accounts/${id}/activate`);
};

export const inactiveAccount = ({ id }) => {
  return (dispatch) => ApiService.post(`accounts/${id}/inactivate`);
};

export const bulkActivateAccounts = ({ ids }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.post(`accounts/bulk/activate`, null, { params: { ids } })
        .then((response) => {
          dispatch({
            type: t.BULK_ACTIVATE_ACCOUNTS,
            payload: { ids },
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};

export const bulkInactiveAccounts = ({ ids }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.post(`accounts/bulk/inactivate`, null, { params: { ids } })
        .then((response) => {
          dispatch({
            type: t.BULK_INACTIVATE_ACCOUNTS,
            payload: { ids },
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};

export const deleteAccount = ({ id }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.delete(`accounts/${id}`)
        .then((response) => {
          dispatch({ type: t.ACCOUNT_DELETE, id });
          resolve(response);
        })
        .catch((error) => {
          reject(error.response.data.errors || []);
        });
    });
};

export const deleteBulkAccounts = ({ ids }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.delete(`accounts`, { params: { ids } })
        .then((response) => {
          dispatch({
            type: t.ACCOUNTS_BULK_DELETE,
            payload: { ids },
          });
          resolve(response);
        })
        .catch((error) => {
          const { response } = error;
          const { data } = response;
          // const { errors } = data;

          reject(data?.errors);
        });
    });
};

export const fetchAccount = ({ id }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.get(`accounts/${id}`)
        .then((response) => {
          dispatch({
            type: t.ACCOUNT_SET,
            payload: {
              account: response.data.account,
            }
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};


export const setBulkAction = ({ action }) => {
  return (dispatch) => dispatch({
    type: t.ACCOUNTS_BULK_ACTION,
    payload: { action }
  });
}