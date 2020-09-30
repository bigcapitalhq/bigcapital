import ApiService from 'services/ApiService';
import t from 'store/types';

export const submitPaymentReceive = ({ form }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.post('sales/payment_receives', form)
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

export const editPaymentReceive = (id, form) => {
  return (dispatch) =>
    new Promise((resolve, rejcet) => {
      ApiService.post(`sales/payment_receives/${id}`, form)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          const { response } = error;
          const { data } = response;

          rejcet(data?.errors);
        });
    });
};

export const deletePaymentReceive = ({ id }) => {
  return (dispatch) =>
    new Promise((resovle, reject) => {
      ApiService.delete(`sales/payment_receives/${id}`)
        .then((response) => {
          dispatch({ type: t.PAYMENT_RECEIVE_DELETE, payload: { id } });
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
      ApiService.get(`sales/payment_receives/${id}`, {})
        .then((response) => {
          dispatch({
            type: t.RELOAD_INVOICES,
            payload: {
              sales_invoices: response.data.paymentReceive.entries.map(
                (e) => e.invoice,
              ),
            },
          });
          dispatch({
            type: t.PAYMENT_RECEIVE_SET,
            payload: {
              id,
              paymentReceive: response.data.paymentReceive,
    
            },
          });
          resovle(response);
        })
        .catch((error) => {
          // const { response } = error;
          // const { data } = response;
          // reject(data?.errors);
          reject(error);
        });
    });
};

export const fetchPaymentReceivesTable = ({ query = {} }) => {
  return (dispatch, getState) =>
    new Promise((resolve, rejcet) => {
      const pageQuery = getState().paymentReceives.tableQuery;

      dispatch({
        type: t.PAYMENT_RECEIVES_TABLE_LOADING,
        payload: {
          loading: true,
        },
      });
      ApiService.get('sales/payment_receives', {
        params: { ...pageQuery, ...query },
      })
        .then((response) => {
          dispatch({
            type: t.PAYMENT_RECEIVES_PAGE_SET,
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
