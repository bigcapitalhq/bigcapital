import LazyLoader from 'components/LazyLoader';

const BASE_URL = '/auth';

export default [
  {
    path: `${BASE_URL}/login`,
    name: 'auth.login',
    component: LazyLoader({
      loader: () => import('containers/Authentication/Login'),
    }),
  },
  {
    path: `${BASE_URL}/register`,
    name: 'auth.register',
    component: LazyLoader({
    loader: () => import('containers/Authentication/Register'),
    }),
  },
  {
    path: `${BASE_URL}/send_reset_password`,
    name: 'auth.reset_password',
    component: LazyLoader({
      loader: () => import('containers/Authentication/SendResetPassword'),
    }),
  },
  {
    path: `${BASE_URL}/reset_password/:token`,
    name: 'auth.send.reset_password',
    component: LazyLoader({
      loader: () => import('containers/Authentication/ResetPassword'),
    }),
  },
  {
    path: `${BASE_URL}/invite/:token/accept`,
    name: 'auth.invite.accept',
    component: LazyLoader({
      loader: () => import('containers/Authentication/InviteAccept'),
    }),
  },
];
