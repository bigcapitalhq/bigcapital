// @ts-nocheck
import LazyLoader from '@/components/LazyLoader';

const BASE_URL = '/auth';

export default [
  {
    path: `${BASE_URL}/login`,
    component: LazyLoader({
      loader: () => import('@/containers/Authentication/Login'),
    }),
  },
  {
    path: `${BASE_URL}/send_reset_password`,
    component: LazyLoader({
      loader: () => import('@/containers/Authentication/SendResetPassword'),
    }),
  },
  {
    path: `${BASE_URL}/reset_password/:token`,
    component: LazyLoader({
      loader: () => import('@/containers/Authentication/ResetPassword'),
    }),
  },
  {
    path: `${BASE_URL}/invite/:token/accept`,
    component: LazyLoader({
      loader: () => import('@/containers/Authentication/InviteAccept'),
    }),
  },
  {
    path: `${BASE_URL}/register/email_confirmation`,
    component: LazyLoader({
      loader: () => import('@/containers/Authentication/EmailConfirmation'),
    }),
  },
  {
    path: `${BASE_URL}/register`,
    component: LazyLoader({
      loader: () => import('@/containers/Authentication/Register'),
    }),
  },
];
