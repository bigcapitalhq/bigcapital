import ApiService from 'services/ApiService';
import t from 'store/types';

export const submitInvoice = ({ form }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: t.SET_DASHBOARD_REQUEST_LOADING,
      });
      ApiService.post('sales/invoices', form)
        .then((response) => {
          dispatch({
            type: t.SET_DASHBOARD_REQUEST_COMPLETED,
          });
          resolve(response);
        })
        .catch((error) => {
          const { response } = error;
          const { data } = response;
          dispatch({
            type: t.SET_DASHBOARD_REQUEST_COMPLETED,
          });

          reject(data?.errors);
        });
    });
};

export const deleteInvoice = ({ id }) => {
  return (dispatch) =>
    new Promise((resovle, reject) => {
      ApiService.delete(`invoice/${id}`)
        .then((response) => {
          dispatch({ type: t.INVOICE_DELETE });
          resovle(response);
        })
        .catch((error) => {
          reject(error.response.data.errors || []);
        });
    });
};

export const editInvoice = (id, form) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: t.SET_DASHBOARD_REQUEST_LOADING,
      });
      ApiService.post(`invoice/${id}`, form)
        .then((response) => {
          dispatch({
            type: t.SET_DASHBOARD_REQUEST_COMPLETED,
          });
          resolve(response);
        })
        .catch((error) => {
          const { response } = error;
          const { data } = response;

          dispatch({
            type: t.SET_DASHBOARD_REQUEST_COMPLETED,
          });
          reject(data?.errors);
        });
    });
};
export const fetchInvoicesTable = ({ query = {} }) => {
  return (dispatch, getState) =>
    new Promise((resolve, rejcet) => {
      const pageQuery = getState().invoices.tableQuery;

      dispatch({
        type: t.INVOICES_TABLE_LOADING,
        payload: {
          loading: true,
        },
      });
      ApiService.get('invoices', {
        params: { ...pageQuery, ...query },
      })
        .then((response) => {
          dispatch({
            type: t.INVOICES_PAGE_SET,
            payload: {
              invoices: response.data.invoices.results,
              pagination: response.data.invoices.pagination,
              customViewId: response.data.customViewId || -1,
            },
          });
          dispatch({
            type: t.INVOICES_ITEMS_SET,
            payload: {
              invoices: response.data.invoices.results,
            },
          });
          dispatch({
            type: t.INVOICES_PAGINATION_SET,
            payload: {
              pagination: response.data.invoices.pagination,
              customViewId: response.data.customViewId || -1,
            },
          });
          dispatch({
            type: t.INVOICES_TABLE_LOADING,
            payload: {
              loading: false,
            },
          });
          resolve(response);
        })
        .catch((error) => {
          rejcet(error);
        });
    });
};

export const fetchInvoice = ({ id }) => {
  return (dispatch) =>
    new Promise((resovle, reject) => {
      ApiService.get(`invoices/${id}`)
        .then((response) => {
          dispatch({
            type: t.INVOICE_SET,
            payload: {
              id,
              invoice: response.data.invoice,
            },
          });
          resovle(response);
        })
        .catch((error) => {
          const { response } = error;
          const { data } = response;
          reject(data?.errors);
        });
    });
};
