
const routes = [
  {
    name: 'auth',
    path: '/',
    component: () => import(/* webpackChunkName: "auth" */
      '@/pages/Auth/Auth.vue'),
    children: [
      {
        name: 'login',
        path: '/login',
        component: () => import(/* webpackChunkName: "login" */
          '@/pages/Auth/Login.vue'),
      },
      {
        name: 'forgetPassword',
        path: '/forget_password',
        component: () => import(/* webpackChunkName: "forget_password" */
          '@/pages/Auth/ForgetPassword.vue'),
      },
    ],
  },
  {
    name: 'dashboard',
    path: '/dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */
      '@/pages/Dashboard/Dashboard.vue'),
    children: [
      {
        name: 'dashboard.home',
        path: '/home',
        component: () => import(/* webpackChunkName: "dashboard_home" */
          '@/pages/Dashboard/Home.vue'),
      },
    ],
  },
];

export default routes;
