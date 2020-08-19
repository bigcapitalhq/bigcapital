import ApiService from 'services/ApiService';
import t from 'store/types';

export const submitInvoice = ({ form }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      // @todo remove dead-code
      dispatch({
        type: t.SET_DASHBOARD_REQUEST_LOADING,
      });
      ApiService.post('sales/invoices', form)
        .then((response) => {
          // @todo remove dead-code
          dispatch({
            type: t.SET_DASHBOARD_REQUEST_COMPLETED,
          });
          resolve(response);
        })
        .catch((error) => {
          const { response } = error;
          const { data } = response;
          // @todo remove dead-code
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
      ApiService.delete(`sales/invoices/${id}`)
        .then((response) => {
          dispatch({
            type: t.INVOICE_DELETE,
            payload: { id },
          });
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
      ApiService.post(`sales/invoices/${id}`, form)
        .then((response) => {
          // @todo remove dead-code
          dispatch({
            type: t.SET_DASHBOARD_REQUEST_COMPLETED,
          });
          resolve(response);
        })
        .catch((error) => {
          const { response } = error;
          const { data } = response;
          
          // @todo remove dead-code
          dispatch({
            type: t.SET_DASHBOARD_REQUEST_COMPLETED,
          });
          reject(data?.errors);
        });
    });
};

export const fetchInvoicesTable = ({ query } = {}) => {
  return (dispatch, getState) =>
    new Promise((resolve, reject) => {
      const pageQuery = getState().sales_invoices.tableQuery;
      dispatch({
        type: t.INVOICES_TABLE_LOADING,
        payload: {
          loading: true,
        },
      });
      ApiService.get('sales/invoices', {
        params: { ...pageQuery, ...query },
      })
        .then((response) => {
          dispatch({
            type: t.INVOICES_PAGE_SET,
            payload: {
              sales_invoices: response.data.sales_invoices.results,
              pagination: response.data.sales_invoices.pagination,
              customViewId: response.data.customViewId || -1,
            },
          });
          dispatch({
            type: t.INVOICES_ITEMS_SET,
            payload: {
              sales_invoices: response.data.sales_invoices.results,
            },
          });
          dispatch({
            type: t.INVOICES_PAGINATION_SET,
            payload: {
              pagination: response.data.sales_invoices.pagination,
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
          reject(error);
        });
    });
};

export const fetchInvoice = ({ id }) => {
  return (dispatch) =>
    new Promise((resovle, reject) => {
      ApiService.get(`sales/invoices/${id}`)
        .then((response) => {
          dispatch({
            type: t.INVOICE_SET,
            payload: {
              id,
              sale_invoice: response.data.sale_invoice,
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
