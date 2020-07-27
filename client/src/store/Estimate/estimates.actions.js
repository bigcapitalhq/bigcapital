import ApiService from 'services/ApiService';
import t from 'store/types';

export const submitEstimate = ({ form }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: t.SET_DASHBOARD_REQUEST_LOADING,
      });
      ApiService.post('sales/estimates', form)
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

export const editEstimate = (id, form) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: t.SET_DASHBOARD_REQUEST_LOADING,
      });
      ApiService.post(`estimates/${id}`, form)
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

export const deleteEstimate = ({ id }) => {
  return (dispatch) =>
    new Promise((resovle, reject) => {
      ApiService.delete(`estimates/${id}`)
        .then((response) => {
          dispatch({ type: t.ESTIMATE_DELETE });
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
      ApiService.get(`estimate/${id}`)
        .then((response) => {
          dispatch({
            type: t.ESTIMATE_SET,
            payload: {
              id,
              estimate: response.data.estimate,
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
      const pageQuery = getState().estimates.tableQuery;

      dispatch({
        type: t.ESTIMATES_TABLE_LOADING,
        payload: {
          loading: true,
        },
      });
      ApiService.get('estimates', {
        params: { ...pageQuery, ...query },
      })
        .then((response) => {
          dispatch({
            type: t.ESTIMATES_PAGE_SET,
            payload: {
              estimates: response.data.estimates.results,
              pagination: response.data.estimates.pagination,
              customViewId: response.data.customViewId || -1,
            },
          });
          dispatch({
            type: t.ESTIMATES_ITEMS_SET,
            payload: {
              estimates: response.data.estimates.results,
            },
          });
          dispatch({
            type: t.ESTIMATES_PAGINATION_SET,
            payload: {
              pagination: response.data.estimates.pagination,
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
