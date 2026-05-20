import ApiService from '@/services/ApiService';
import { CLEAR_CURRENCY_FORM_ERRORS, CURRENCIES_REGISTERED_SET, CURRENCIES_TABLE_LOADING, CURRENCY_CODE_DELETE } from '@/store/types';;

export const submitCurrencies = ({ form }: { form: unknown }) => {
  return (_dispatch: any) => ApiService.post('currencies', form);
};

export const deleteCurrency = ({ currency_code }: { currency_code: string }) => {
  return (dispatch: any) =>
    new Promise((resolve, reject) => {
      ApiService.delete(`currencies/${currency_code}`)
        .then((response) => {
          dispatch({ type: CURRENCY_CODE_DELETE, currency_code });
          resolve(response);
        })
        .catch((error) => {
          reject(error.response.data.errors || []);
        });
    });
};

export const editCurrency = ({ id, form }: { id: string | number; form: unknown }) => {
  return (dispatch: any) =>
    new Promise((resolve, reject) => {
      ApiService.post(`currencies/${id}`, form)
        .then((response) => {
          dispatch({ type: CLEAR_CURRENCY_FORM_ERRORS });
          resolve(response);
        })
        .catch((error) => {
          const { response } = error;
          const { data } = response;
          const { errors } = data;
          dispatch({ type: CLEAR_CURRENCY_FORM_ERRORS });
          if (errors) {
            dispatch({ type: CLEAR_CURRENCY_FORM_ERRORS, errors });
          }
          reject(error);
        });
    });
};

export const fetchCurrencies = () => {
  return (dispatch: any) =>
    new Promise((resolve, reject) => {
      dispatch({ type: CURRENCIES_TABLE_LOADING, loading: true });
      ApiService.get('currencies')
        .then((response) => {
          dispatch({ type: CURRENCIES_REGISTERED_SET, currencies: response.data.currencies });
          dispatch({ type: CURRENCIES_TABLE_LOADING, loading: false });
          resolve(response);
        })
        .catch((error) => reject(error));
    });
};
