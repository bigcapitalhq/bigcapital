import Login from '../pages/Authentication/Login';
import ResetPassword from '../pages/Authentication/ResetPassword';

export default [
  {
    path: '/login',
    exact: true,
    component: Login,
  },
  {
    path: '/reset_password',
    exact: true,
    component: ResetPassword,
  }
];