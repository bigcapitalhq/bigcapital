import ApiService from 'services/ApiService';
import t from 'store/types';

export const submitOptions = ({ form }) => {
  return (dispatch) => {
    return ApiService.post('options', form);
  };
};

export const FetchOptions = ({ form }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.get('options')
        .then((response) => {
          dispatch({
            type: t.SETTING_SET,
            options: response.data.options,
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};
