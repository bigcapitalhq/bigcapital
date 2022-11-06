// @ts-nocheck
import ApiService from "services/ApiService";
import t from '@/store/types';

export const savePreferences = ({ options }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.post('options', { options }).then((response) => {
      dispatch({
        type: t.OPTIONS_SET,
        options: response.data.options,
      });
      resolve(response);
    }).catch(error => { reject(error); });
  });
};

export const fetchPreferences = () => {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.get('options').then((response) => {
      dispatch({
        type: t.OPTIONS.SET,
        options: response.data.options,
      });
      resolve(response);
    }).catch(error => { reject(error); });
  })
}