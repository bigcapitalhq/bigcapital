import ApiService from 'services/ApiService';
import t from 'store/types';

export const submitPaymentReceive = ({ form }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: t.SET_DASHBOARD_REQUEST_LOADING,
      });
      ApiService.post('sales/payment_receives', form)
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

export const editPaymentReceive = (id, form) => {
  return (dispatch) =>
    new Promise((resolve, rejcet) => {
      dispatch({
        type: t.SET_DASHBOARD_REQUEST_LOADING,
      });
      ApiService.post(`sales/payment_receives/${id}`, form)
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

export const deletePaymentReceive = ({ id }) => {
  return (dispatch) =>
    new Promise((resovle, reject) => {
      ApiService.delete(`payment_receives/${id}`)
        .then((response) => {
          dispatch({ type: t.PAYMENT_RECEIVE_DELETE });
          resovle(response);
        })
        .catch((error) => {
          reject(error.response.data.errors || []);
        });
    });
};

export const fetchPaymentReceive = ({ id }) => {
  return (dispatch) =>
    new Promise((resovle, reject) => {
      ApiService.get(`payment_receives/${id}`)
        .then((response) => {
          dispatch({
            type: t.PAYMENT_RECEIVE_SET,
            payload: {
              id,
              payment_receive: response.data.payment_receive,
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

export const fetchPaymentReceivesTable = ({ query = {} }) => {
  return (dispatch, getState) =>
    new Promise((resolve, rejcet) => {
      const pageQuery = getState().payment_receive.tableQuery;

      dispatch({
        type: t.PAYMENT_RECEIVES_TABLE_LOADING,
        payload: {
          loading: true,
        },
      });
      ApiService.get('payment_receives', {
        params: { ...pageQuery, ...query },
      })
        .then((response) => {
          dispatch({
            type: t.RECEIPTS_PAGE_SET,
            payload: {
              payment_receives: response.data.payment_receives.results,
              pagination: response.data.payment_receives.pagination,
              customViewId: response.data.customViewId || -1,
            },
          });
          dispatch({
            type: t.PAYMENT_RECEIVES_ITEMS_SET,
            payload: {
              payment_receives: response.data.payment_receives.results,
            },
          });
          dispatch({
            type: t.PAYMENT_RECEIVES_PAGINATION_SET,
            payload: {
              pagination: response.data.payment_receives.pagination,
              customViewId: response.data.customViewId || -1,
            },
          });
          dispatch({
            type: t.PAYMENT_RECEIVES_TABLE_LOADING,
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
