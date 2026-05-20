import { AUTH_LOGIN_SUCCESS, AUTH_LOGOUT, AUTH_SET_AUTH_TOKEN, AUTH_SET_EMAIL_VERIFIED, AUTH_SET_LOCALE, AUTH_SET_ORGANIZATIOIN_ID, AUTH_SET_USER_ID, RESET } from '@/store/types';

export const setLogin = () => ({ type: AUTH_LOGIN_SUCCESS });
export const setLogout = () => ({ type: AUTH_LOGOUT });
export const setStoreReset = () => ({ type: RESET });

export const setEmailConfirmed = (verified?: boolean, email?: string) => ({
  type: AUTH_SET_EMAIL_VERIFIED,
  payload: { verified, email },
});
export const setOrganizationId = (organizationId: string) => ({
  type: AUTH_SET_ORGANIZATIOIN_ID,
  payload: { organizationId },
});
export const setAuthToken = (token: string) => ({
  type: AUTH_SET_AUTH_TOKEN,
  payload: { token },
});
export const setAuthUserId = (userId: string) => ({
  type: AUTH_SET_USER_ID,
  payload: { userId },
});
export const setLocale = (locale: string) => ({
  type: AUTH_SET_LOCALE,
  payload: { locale },
});
