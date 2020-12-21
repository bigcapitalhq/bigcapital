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
      ApiService.get(`vendors`, { params: { ...pageQuery, ...query } })
        .then((response) => {
          dispatch({
            type: t.VENDORS_PAGE_SET,
            payload: {
              vendors: response.data.vendors,
              customViewId:
                response.data?.filter_meta?.view?.custom_view_id || -1,
              paginationMeta: response.data.pagination,
            },
          });
          dispatch({
            type: t.VENDORS_ITEMS_SET,
            payload: {
              vendors: response.data.vendors,
            },
          });
          dispatch({
            type: t.VENDORS_PAGINATION_SET,
            payload: {
              pagination: response.data.pagination,
              customViewId:
                response.data?.filter_meta?.view?.custom_view_id || -1,
            },
          });
          dispatch({
            type: t.VENDORS_TABLE_LOADING,
            payload: { loading: false },
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
      ApiService.post(`vendors/${id}`, form)
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
      ApiService.post('vendors', form)
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

export const fetchVendor = ({ id }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.get(`vendors/${id}`)
        .then((response) => {
          dispatch({
            type: t.VENDOR_SET,
            payload: {
              id,
              vendor: response.data.vendor,
            },
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};
