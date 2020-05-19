import ApiService from 'services/ApiService';
import t from 'store/types';

export const fetchExchangeRates = () => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: t.SET_DASHBOARD_REQUEST_LOADING,
      });
      dispatch({
        type: t.EXCHANGE_RATE_TABLE_LOADING,
        loading: true,
      });
      ApiService.get('exchange_rates')
        .then((response) => {
          dispatch({
            type: t.EXCHANGE_RATE_LIST_SET,
            exchange_rates: response.data.exchange_rates.results,
          });
          dispatch({
            type: t.SET_DASHBOARD_REQUEST_COMPLETED,
          });
          dispatch({
            type: t.EXCHANGE_RATE_TABLE_LOADING,
            loading: false,
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};

export const submitExchangeRate = ({ form }) => {
  return (dispatch) => {
    return ApiService.post('exchange_rates', form);
  };
};

export const deleteExchangeRate = (id) => {
  return (dispatch) => ApiService.delete(`exchange_rates/${id}`);
};

export const editExchangeRate = (id, form) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.post(`exchange_rates/${id}`, form)
        .then((response) => {
          dispatch({ type: t.CLEAR_EXCHANGE_RATE_FORM_ERRORS });
          resolve(response);
        })
        .catch((error) => {
          const { response } = error;
          const { data } = response;
          const { errors } = data;

          dispatch({ type: t.CLEAR_EXCHANGE_RATE_FORM_ERRORS });
          if (errors) {
            dispatch({ type: t.CLEAR_EXCHANGE_RATE_FORM_ERRORS, errors });
          }
          reject(error);
        });
    });
};



export const deleteBulkExchangeRates = ({ ids }) => {
  return dispatch => new Promise((resolve, reject) => {
    ApiService.delete(`exchange_rates/bulk`, { params: { ids }}).then((response) => {
      dispatch({
        type: t.EXCHANGE_RATES_BULK_DELETE,
        payload: { ids }
      });
      resolve(response);
    }).catch((error) => {
      reject(error);
    });
  });
};