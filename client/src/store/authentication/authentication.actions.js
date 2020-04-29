import ApiService from 'services/ApiService';
import t from 'store/types';

export default function login({ form }) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      ApiService.post('auth/login', form).then(response => {
        const { data } = response;

        dispatch({ type: t.LOGIN_CLEAR_ERRORS });
        if (data.token && data.user) {
          dispatch({
            type: t.LOGIN_SUCCESS,
            payload: {
              user: data.user,
              token: data.token,
            },            
          });
        }
        resolve(response);
      }).catch((error) => {
        const { response } = error;
        const { data } = response;
        const { errors = [] } = data;

        reject(errors);
      });
    });
  }
}