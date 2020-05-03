import ApiService from 'services/ApiService';
import t from 'store/types';

export const fetchUsers = () => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.get(`users`)
        .then((response) => {
          dispatch({
            type: t.USERS_LIST_SET,
            users: response.data.users,
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};

export const fetchUser = ({ id }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.get(`users/${id}`)
        .then((response) => {
          dispatch({
            type: t.USER_DETAILS_SET,
            user: response.data.user,
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};

export const deleteUser = ({ id }) => {
  return (dispatch) => ApiService.delete(`users/${id}`);
};

export const submitInvite = ({ form }) => {
  return (dispatch) => ApiService.post(`invite/send`, form);
};

export const editUser = ({ form, id }) => {
  return (dispatch) => ApiService.post(`users/${id}`, form);
};

export const inactiveUser = ({ id }) => {
  return (dispatch) => ApiService.put(`users/${id}/inactive`);
};

export const activeUser = ({ id }) => {
  return (dispatch) => ApiService.put(`users/${id}/active`);
};
