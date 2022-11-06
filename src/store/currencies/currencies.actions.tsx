// @ts-nocheck
import ApiService from '@/services/ApiService';
import t from '@/store/types';

export const submitCurrencies = ({ form }) => {
  return (dispatch) => {
    return ApiService.post('currencies', form);
  };
};

export const deleteCurrency = ({ currency_code }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.delete(`currencies/${currency_code}`)
        .then((response) => {
          dispatch({ type: t.CURRENCY_CODE_DELETE, currency_code });
          resolve(response);
        })
        .catch((error) => {
          reject(error.response.data.errors || []);
        });
    });
};

export const editCurrency = ({ id, form }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.post(`currencies/${id}`, form)
        .then((response) => {
          dispatch({ type: t.CLEAR_CURRENCY_FORM_ERRORS });
          resolve(response);
        })
        .catch((error) => {
          const { response } = error;
          const { data } = response;
          const { errors } = data;

          dispatch({ type: t.CLEAR_CURRENCY_FORM_ERRORS });
          if (errors) {
            dispatch({ type: t.CLEAR_CURRENCY_FORM_ERRORS, errors });
          }
          reject(error);
        });
    });
};

export const fetchCurrencies = () => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: t.CURRENCIES_TABLE_LOADING,
        loading: true,
      });
      ApiService.get('currencies')
        .then((response) => {
          dispatch({
            type: t.CURRENCIES_REGISTERED_SET,
            currencies: response.data.currencies,
          });
          dispatch({
            type: t.CURRENCIES_TABLE_LOADING,
            loading: false,
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};
