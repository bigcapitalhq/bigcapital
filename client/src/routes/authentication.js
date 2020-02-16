import Login from 'containers/Authentication/Login';
import ResetPassword from 'containers/Authentication/ResetPassword';

export default [
  // {
  //   path: '/',
  //   exact: true,
  //   component: Login,
  // },
  {
    path: '/auth/login',
    exact: true,
    component: Login,
  },
  {
    path: '/auth/reset_password',
    exact: true,
    component: ResetPassword,
  }
];