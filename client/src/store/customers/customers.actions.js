import ApiService from 'services/ApiService';
import t from 'store/types';

export const submitCustomer = ({ form }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.post('customers', form)
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

export const editCustomer = ({ form, id }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.post(`customers/${id}`, form)
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

export const fetchCustomers = ({ query }) => {
  return (dispatch, getState) =>
    new Promise((resolve, reject) => {
      const pageQuery = getState().customers.tableQuery;

      dispatch({
        type: t.CUSTOMERS_TABLE_LOADING,
        payload: { loading: true },
      });
      ApiService.get(`customers`, { params: { ...pageQuery, ...query } })
        .then((response) => {
          dispatch({
            type: t.CUSTOMERS_PAGE_SET,
            payload: {
              customers: response.data.customers,
              customViewId: response.data.customViewId || -1,
              paginationMeta: response.data.pagination,
            },
          });
          dispatch({
            type: t.CUSTOMERS_ITEMS_SET,
            payload: {
              customers: response.data.customers,
            },
          });
          dispatch({
            type: t.CUSTOMERS_PAGINATION_SET,
            payload: {
              pagination: response.data.pagination,
              customViewId: response.data.customViewId || -1,
            },
          });
          dispatch({
            type: t.CUSTOMERS_TABLE_LOADING,
            payload: { loading: false },
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};

export const fetchCustomer = ({ id }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.get(`customers/${id}`)
        .then((response) => {
          dispatch({
            type: t.CUSTOMER_SET,
            payload: {
              id,
              customer: response.data.customer,
            },
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};

export const deleteCustomer = ({ id }) => {
  return (dispatch) =>
    new Promise((resovle, reject) => {
      ApiService.delete(`customers/${id}`)
        .then((response) => {
          dispatch({
            type: t.CUSTOMER_DELETE,
            payload: { id },
          });
          resovle(response);
        })
        .catch((error) => {
          reject(error.response.data.errors || []);
        });
    });
};

export const deleteBulkCustomers = ({ ids }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.delete('customers', { params: { ids } })
        .then((response) => {
          dispatch({
            type: t.CUSTOMERS_BULK_DELETE,
            payload: { ids },
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error.response.data.errors || []);
        });
    });
};
