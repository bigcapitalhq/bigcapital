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
    path: `${BASE_URL}/reset_password`,
    name: 'auth.send.reset_password',
    component: LazyLoader({
      loader: () => import('containers/Authentication/ResetPassword'),
    }),
  },
  {
    path: `${BASE_URL}/send_invite`,
    name: 'auth.send_invite',
    component: LazyLoader({
      loader: () => import('containers/Authentication/SendInvite'),
    }),
  },
  {
    path: `${BASE_URL}/invite/:token`,
    name: 'auth.invite',
    component: LazyLoader({
      loader: () => import('containers/Authentication/Invite'),
    }),
  },
];
