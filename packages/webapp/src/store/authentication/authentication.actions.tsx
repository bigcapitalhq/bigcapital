// @ts-nocheck
import t from '@/store/types';

export const setLogin = () => ({ type: t.LOGIN_SUCCESS });
export const setLogout = () => ({ type: t.LOGOUT });
export const setStoreReset = () => ({ type: t.RESET });
export const setEmailConfirmed = (verified?: boolean, email?: string) => ({
  type: t.SET_EMAIL_VERIFIED,
  action: { verified, email },
});
export const setOrganizationId = (organizationId: string) => ({
  type: t.SET_ORGANIZATIOIN_ID,
  action: { organizationId },
});
export const setAuthToken = (token: string) => ({
  type: t.SET_AUTH_TOKEN,
  action: { token },
});
export const setAuthTenantId = (tenantId: string) => ({
  type: t.SET_TENANT_ID,
  action: { tenantId },
});
export const setAuthUserId = (userId: string) => ({
  type: t.SET_USER_ID,
  action: { userId },
});
export const setLocale = (locale: string) => ({
  type: t.SET_LOCALE,
  action: { locale },
});
