import t from 'store/types';

export const setLogin = ({ user, token, tenant }) => ({
  type: t.LOGIN_SUCCESS,
  payload: { user, token, tenant, },
});

export const setLogout = () => ({ type: t.LOGOUT });
export const setStoreReset = () => ({ type: t.RESET });