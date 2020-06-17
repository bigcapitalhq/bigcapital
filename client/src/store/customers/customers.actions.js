import ApiService from 'services/ApiService';
import t from 'store/types';

export const submitCustomer = ({ form }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: t.SET_DASHBOARD_REQUEST_LOADING,
      });

      ApiService.post('customers', form)
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

export const editCustomer = ({ form, id }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: t.SET_DASHBOARD_REQUEST_LOADING,
      });

      ApiService.post(`customers/${id}`, form)
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

export const fetchCustomers = ({ query }) => {
  return (dispatch, getState) =>
    new Promise((resolve, reject) => {
      const pageQuery = getState().items.tableQuery;
      dispatch({
        type: t.ITEMS_TABLE_LOADING,
        payload: { loading: true },
      });
      dispatch({
        type: t.SET_DASHBOARD_REQUEST_LOADING,
      });
      ApiService.get(`customers`, { params: { ...pageQuery, ...query } })
        .then((response) => {
          dispatch({
            type: t.CUSTOMER_SET,
            customers: response.data.customers.results,
          });

          dispatch({
            type: t.CUSTOMERS_PAGE_SET,
            customers: response.data.customers.results,
            customViewId: response.data.customers.customViewId,
            paginationMeta: response.data.customers.pagination,
          });
          dispatch({
            type: t.CUSTOMERS_TABLE_LOADING,
            payload: { loading: false },
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

export const deleteCustomer = ({ id }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.delete(`customers/${id}`)
        .then((response) => {
          dispatch({ type: t.CUSTOMER_DELETE, id });
          resolve(response);
        })
        .catch((error) => {
          reject(error.response.data.errors || []);
        });
    });
};

