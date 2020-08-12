import ApiService from 'services/ApiService';
import t from 'store/types';

export const fetchVendorsTable = ({ query }) => {
  return (dispatch, getState) =>
    new Promise((resolve, reject) => {
      const pageQuery = getState().vendors.tableQuery;
      dispatch({
        type: t.VENDORS_TABLE_LOADING,
        payload: { loading: true },
      });
      dispatch({
        type: t.SET_DASHBOARD_REQUEST_LOADING,
      });
      ApiService.get(`vendors`, { params: { ...pageQuery, ...query } })
        .then((response) => {
          dispatch({
            type: t.VENDORS_PAGE_SET,
            payload: {
              vendors: response.data.vendors.results,
              pagination: response.data.vendors.pagination,
              customViewId: response.data.customViewId,
            },
          });

          dispatch({
            type: t.VENDORS_ITEMS_SET,
            payload: {
              vendors: response.data.vendors.results,
            },
          });

          dispatch({
            type: t.VENDORS_PAGINATION_SET,
            payload: {
              pagination: response.data.vendors.pagination,
              customViewId: response.data.customViewId || -1,
            },
          });

          dispatch({
            type: t.VENDORS_TABLE_LOADING,
            payload: { loading: false },
          });
          dispatch({
            type: t.SET_DASHBOARD_REQUEST_COMPLETED,
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};

export const editVendor = ({ form, id }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: t.SET_DASHBOARD_REQUEST_LOADING,
      });

      ApiService.post(`vendors/${id}`, form)
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

export const deleteVendor = ({ id }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.delete(`vendors/${id}`)
        .then((response) => {
          dispatch({ type: t.VENDOR_DELETE, payload: { id } });
          resolve(response);
        })
        .catch((error) => {
          reject(error.response.data.errors || []);
        });
    });
};

export const submitVendor = ({ form }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: t.SET_DASHBOARD_REQUEST_LOADING,
      });

      ApiService.post('vendors', form)
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
