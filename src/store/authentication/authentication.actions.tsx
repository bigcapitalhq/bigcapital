import t from '@/store/types';

export const setLogin = () => ({ type: t.LOGIN_SUCCESS });
export const setLogout = () => ({ type: t.LOGOUT });
export const setStoreReset = () => ({ type: t.RESET });