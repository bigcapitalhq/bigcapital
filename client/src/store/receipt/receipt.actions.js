import ApiService from 'services/ApiService';
import t from 'store/types';

export const submitReceipt = ({ form }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: t.SET_DASHBOARD_REQUEST_LOADING,
      });
      ApiService.post('sales/receipts', form)
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

export const deleteReceipt = ({ id }) => {
  return (dispatch) =>
    new Promise((resovle, reject) => {
      ApiService.delete(`receipts/${id}`)
        .then((response) => {
          dispatch({ type: t.RECEIPT_DELETE });
          resovle(response);
        })
        .catch((error) => {
          reject(error.response.data.errors || []);
        });
    });
};

export const editReceipt = (id, form) => {
  return (dispatch) =>
    new Promise((resolve, rejcet) => {
      dispatch({
        type: t.SET_DASHBOARD_REQUEST_LOADING,
      });
      ApiService.delete(`receipt/${id}`, form)
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
          rejcet(data?.errors);
        });
    });
};

export const fetchReceipt = ({ id }) => {
  return (dispatch) =>
    new Promise((resovle, reject) => {
      ApiService.get(`receipt/${id}`)
        .then((response) => {
          dispatch({
            type: t.RECEIPT_SET,
            payload: {
              id,
              receipt: response.data.receipt,
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

export const fetchReceiptsTable = ({ query = {} }) => {
  return (dispatch, getState) =>
    new Promise((resolve, rejcet) => {
      const pageQuery = getState().receipt.tableQuery;

      dispatch({
        type: t.RECEIPTS_TABLE_LOADING,
        payload: {
          loading: true,
        },
      });
      ApiService.get('receipts', {
        params: { ...pageQuery, ...query },
      })
        .then((response) => {
          dispatch({
            type: t.RECEIPTS_PAGE_SET,
            payload: {
              receipts: response.data.receipts.results,
              pagination: response.data.receipts.pagination,
              customViewId: response.data.customViewId || -1,
            },
          });
          dispatch({
            type: t.RECEIPTS_ITEMS_SET,
            payload: {
              receipts: response.data.receipts.results,
            },
          });
          dispatch({
            type: t.RECEIPTS_PAGINATION_SET,
            payload: {
              pagination: response.data.receipts.pagination,
              customViewId: response.data.customViewId || -1,
            },
          });
          dispatch({
            type: t.RECEIPTS_TABLE_LOADING,
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
