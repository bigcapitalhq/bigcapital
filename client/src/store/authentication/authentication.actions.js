import ApiService from 'services/ApiService';
import t from 'store/types';

export function login({ form }) {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.post('auth/login', form).then((response) => {
      const { data } = response;

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

export const register = ({ form }) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      ApiService.post('auth/register', form)
        .then((response) => { resolve(response); })
        .catch(error => { reject(error.response.data.errors || []); })
    })
  };
}

export const resetPassword = ({ form, token }) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      ApiService.post(`auth/reset/${token}`, form)
        .then((response) => { resolve(response); })
        .catch(error => { reject(error.response.data.errors || []); })
    })
  };
};

export const sendResetPassword = (email) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      ApiService.post('auth/send_reset_password', email)
        .then((response) => { resolve(response); })
        .catch(error => { reject(error.response.data.errors || []); })
    })
  };
};

export const inviteAccept = ({ form, token }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.post(`invite/accept/${token}`, { ...form })
      .then((response) => { resolve(response); })
      .catch((error) => { reject(error.response.data.errors || []) });
  });
};

export const inviteMetaByToken = ({ token }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.get(`invite/invited/${token}`)
      .then((response) => { resolve(response); })
      .catch((error) => { reject(error.response.data.errors || []) });
  }); 
}