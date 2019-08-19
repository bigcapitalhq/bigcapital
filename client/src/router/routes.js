
const routes = [
  {
    name: 'auth',
    path: '/',
    component: () => import(/* webpackChunkName: "auth" */
      '@/pages/Auth/Auth.vue'),
    children: [
      {
        name: 'authLogin',
        path: '/login',
        component: () => import(/* webpackChunkName: "login" */
          '@/pages/Auth/Login.vue'),
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
