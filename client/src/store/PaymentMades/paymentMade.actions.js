import ApiService from 'services/ApiService';
import t from 'store/types';

export const submitPaymentMade = ({ form }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.post('purchases/bill_payments', form)
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

export const deletePaymentMade = ({ id }) => {
  return (dispatch) =>
    new Promise((resovle, reject) => {
      ApiService.delete(`purchases/bill_payments/${id}`)
        .then((response) => {
          dispatch({ type: t.PAYMENT_MADE_DELETE, payload: { id } });
          resovle(response);
        })
        .catch((error) => {
          reject(error.response.data.errors || []);
        });
    });
};

export const editPaymentMade = (id, form) => {
  return (dispatch) =>
    new Promise((resolve, rejcet) => {
      ApiService.post(`purchases/bill_payments/${id}`, form)
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

export const fetchPaymentMadesTable = ({ query = {} }) => {
  return (dispatch, getState) =>
    new Promise((resolve, rejcet) => {
      const pageQuery = getState().paymentMades.tableQuery;

      dispatch({
        type: t.PAYMENT_MADES_TABLE_LOADING,
        payload: {
          loading: true,
        },
      });
      ApiService.get('purchases/bill_payments', {
        params: { ...pageQuery, ...query },
      })
        .then((response) => {
          dispatch({
            type: t.PAYMENT_MADES_PAGE_SET,
            payload: {
              bill_payments: response.data.bill_payments,
              pagination: response.data.pagination,
              customViewId: response.data.customViewId || -1,
            },
          });
          dispatch({
            type: t.PAYMENT_MADES_ITEMS_SET,
            payload: {
              bill_payments: response.data.bill_payments,
            },
          });
          dispatch({
            type: t.PAYMENT_MADES_PAGINATION_SET,
            payload: {
              pagination: response.data.pagination,
              customViewId: response.data.customViewId || -1,
            },
          });
          dispatch({
            type: t.PAYMENT_MADES_TABLE_LOADING,
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

export const fetchPaymentMade = ({ id }) => {
  return (dispatch) =>
    new Promise((resovle, reject) => {
      ApiService.get(`purchases/bill_payments/${id}`, {})
        .then((response) => {
          dispatch({
            type: t.PAYMENT_MADE_SET,
            payload: {
              id,
              paymentMade: response.data.bill_payment,
            },
          });
          dispatch({
            type: t.BILLS_PAYABLE_BY_PAYMENT_ID,
            payload: {
              billPaymentId: id,
              bills: response.data.bill_payment.payable_bills,
            },
          });
          dispatch({
            type: t.BILLS_ITEMS_SET,
            payload: {
              bills: response.data.bill_payment.payable_bills,
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

export const fetchPaymentMadeBills = ({ paymentMadeId }) => (dispatch) => {
  return new Promise((resolve, reject) => {
    ApiService.get(`purchases/bill_payments/${paymentMadeId}/bills`).then((response) => {
      dispatch({
        type: t.BILLS_ITEMS_SET,
        payload: {
          bills: response.data.bills,
        },
      });
      resolve(response);
    }).catch((error) => { reject(error) });
  });
}