import ApiService from "services/ApiService";
import t from 'store/types';

export const fetchCurrencies = () => {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.get(`currencies/registered`).then((response) => {
      dispatch({
        type: t.CURRENCIES_REGISTERED_SET,
        currencies: response.data.currencies,
      });
      resolve(response);
    }).catch(error => { reject(error); });
  });
};

export const fetchAllCurrencies = () => {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.get(`currencies/all`).then((response) => {
      dispatch({
        type: t.CURRENCIES_ALL_SET,
        currencies: response.data.currencies,
      });
      resolve(response);
    }).catch(error => { reject(error); });
  });
};