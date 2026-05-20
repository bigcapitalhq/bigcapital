// @ts-nocheck
import ApiService from "services/ApiService";
import { OPTIONS, OPTIONS_SET } from '@/store/types';;

export const savePreferences = ({ options }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.post('options', { options }).then((response) => {
      dispatch({
        type: OPTIONS_SET,
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
        type: OPTIONS.SET,
        options: response.data.options,
      });
      resolve(response);
    }).catch(error => { reject(error); });
  })
}