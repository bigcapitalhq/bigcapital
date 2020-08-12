import ApiService from 'services/ApiService';
import t from 'store/types';

export const fetchBillsTable = ({ query = {} }) => {
  return (dispatch, getState) =>
    new Promise((resolve, rejcet) => {
      const pageQuery = getState().bills.tableQuery;

      dispatch({
        type: t.BILLS_TABLE_LOADING,
        payload: {
          loading: true,
        },
      });
      ApiService.get('purchases/bills', {
        params: { ...pageQuery, ...query },
      })
        .then((response) => {
          dispatch({
            type: t.BILLS_PAGE_SET,
            payload: {
              bills: response.data.bills.results,
              pagination: response.data.bills.pagination,
              customViewId: response.data.customViewId || -1,
            },
          });
          dispatch({
            type: t.BILLS_ITEMS_SET,
            payload: {
              bills: response.data.bills.results,
            },
          });
          dispatch({
            type: t.BILLS_PAGINATION_SET,
            payload: {
              pagination: response.data.bills.pagination,
              customViewId: response.data.customViewId || -1,
            },
          });
          dispatch({
            type: t.BILLS_TABLE_LOADING,
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

export const deleteBill = ({ id }) => {
  return (dispatch) =>
    new Promise((resovle, reject) => {
      ApiService.delete(`purchases/bills/${id}`)
        .then((response) => {
          dispatch({ type: t.BILL_DELETE, payload: { id } });
          resovle(response);
        })
        .catch((error) => {
          reject(error.response.data.errors || []);
        });
    });
};

export const submitBill = ({ form }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: t.SET_DASHBOARD_REQUEST_LOADING,
      });
      ApiService.post('purchases/bills', form)
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

export const fetchBill = ({ id }) => {
  return (dispatch) =>
    new Promise((resovle, reject) => {
      ApiService.get(`purchases/bills/${id}`)
        .then((response) => {
          dispatch({
            type: t.BILL_SET,
            payload: {
              id,
              bill: response.data.bill,
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

export const editBill = (id, form) => {
  return (dispatch) =>
    new Promise((resolve, rejcet) => {
      dispatch({
        type: t.SET_DASHBOARD_REQUEST_LOADING,
      });
      ApiService.post(`purchases/bills/${id}`, form)
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
