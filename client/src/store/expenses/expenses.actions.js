import ApiService from 'services/ApiService';
import t from 'store/types';

export const fetchExpensesTable = ({ query } = {}) => {
  return (dispatch, getState) =>
    new Promise((resolve, reject) => {
      const pageQuery = getState().expenses.tableQuery;
      dispatch({
        type: t.EXPENSES_TABLE_LOADING,
        payload: {
          loading: true,
        },
      });
      ApiService.get('expenses', {
        params: { ...pageQuery, ...query },
      })
        .then((response) => {
          dispatch({
            type: t.EXPENSES_PAGE_SET,
            payload: {
              expenses: response.data.expenses.results,
              pagination: response.data.expenses.pagination,
              customViewId: response.data.customViewId || -1,
            },            
          });
          dispatch({
            type: t.EXPENSES_ITEMS_SET,
            payload: {
              expenses: response.data.expenses.results,
            }
          });
          dispatch({
            type: t.EXPENSES_PAGINATION_SET,
            payload: {
              pagination: response.data.expenses.pagination,
              customViewId: response.data.customViewId || -1,
            }
          });
          dispatch({
            type: t.EXPENSES_TABLE_LOADING,
            payload: {
              loading: false,
            },
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};

export const fetchExpense = ({ id }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.get(`expenses/${id}`)
      .then((response) => {
          dispatch({
            type: t.EXPENSE_SET,
            payload: {
              id,
              expense: response.data.expense,
            },
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};

export const editExpense = ({ form, id }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.post(`expenses/${id}`, form)
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

export const submitExpense = ({ form }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.post('expenses', form)
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

export const deleteExpense = ({ id }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.delete(`expenses/${id}`)
        .then((response) => {
          dispatch({
            type: t.EXPENSE_DELETE,
            payload: { id },
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error.response.data.errors || []);
        });
    });
};

export const deleteBulkExpenses = ({ ids }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.delete('expenses', { params: { ids } })
        .then((response) => {
          dispatch({
            type: t.EXPENSES_BULK_DELETE,
            payload: { ids },
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error.response.data.errors || []);
        });
    });
};

export const publishExpense = ({ id }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.post(`expenses/${id}/publish`)
        .then((response) => {
          dispatch({
            type: t.EXPENSE_PUBLISH,
            payload: { id },
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};
