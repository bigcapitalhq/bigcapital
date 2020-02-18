import ApiService from 'services/ApiService';
import t from 'store/types';

export default function login({ form }) {
  return (dispatch) => {
    ApiService.post('/auth/login', form).then(response => {
      const { data } = response;

      if (data.token && data.user) {
        dispatch({
          type: t.LOGIN_SUCCESS,
          user: data.user,
          token: data.token,
        });
      }
    });
  }
}