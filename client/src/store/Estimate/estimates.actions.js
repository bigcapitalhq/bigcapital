import ApiService from 'services/ApiService';
import t from 'store/types';

export const submitEstimate = ({ form }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.post('sales/estimates', form)
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

export const editEstimate = (id, form) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.post(`sales/estimates/${id}`, form)
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

export const deleteEstimate = ({ id }) => {
  return (dispatch) =>
    new Promise((resovle, reject) => {
      ApiService.delete(`sales/estimates/${id}`)
        .then((response) => {
          dispatch({
            type: t.ESTIMATE_DELETE,
            payload: { id },
          });
          resovle(response);
        })
        .catch((error) => {
          reject(error.response.data.errors || []);
        });
    });
};

export const fetchEstimate = ({ id }) => {
  return (dispatch) =>
    new Promise((resovle, reject) => {
      ApiService.get(`sales/estimates/${id}`)
        .then((response) => {
          const { estimate } = response.data;
          dispatch({
            type: t.ESTIMATE_SET,
            payload: {
              id,
              estimate,
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

export const fetchEstimatesTable = ({ query = {} }) => {
  return (dispatch, getState) =>
    new Promise((resolve, rejcet) => {
      const pageQuery = getState().salesEstimates.tableQuery;
      dispatch({
        type: t.ESTIMATES_TABLE_LOADING,
        payload: {
          loading: true,
        },
      });
      ApiService.get('sales/estimates', {
        params: { ...pageQuery, ...query },
      })
        .then((response) => {
          dispatch({
            type: t.ESTIMATES_PAGE_SET,
            payload: {
              sales_estimates: response.data.sales_estimates,
              pagination: response.data.pagination,
              customViewId: response.data.customViewId || -1,
            },
          });
          dispatch({
            type: t.ESTIMATES_ITEMS_SET,
            payload: {
              sales_estimates: response.data.sales_estimates,
            },
          });
          dispatch({
            type: t.ESTIMATES_PAGINATION_SET,
            payload: {
              pagination: response.data.pagination,
              customViewId: response.data.customViewId || -1,
            },
          });
          dispatch({
            type: t.ESTIMATES_TABLE_LOADING,
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
