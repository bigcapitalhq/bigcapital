import LazyLoader from '@/components/LazyLoader';

const BASE_URL = '/auth';

const authenticationRoutes = [
  {
    path: `${BASE_URL}/login`,
    component: LazyLoader({
      loader: () => import('@/containers/Authentication/Login'),
      // loader: () => Promise.resolve(() => <div>Hello World</div>),
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
    path: `${BASE_URL}/register`,
    component: LazyLoader({
      loader: () => import('@/containers/Authentication/Register'),
    }),
  },
];

export default authenticationRoutes;
