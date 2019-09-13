
const routes = [
  {
    name: 'auth',
    path: '/',
    component: () => import(/* webpackChunkName: "auth_container" */
      '@/pages/Auth/AuthContainer.vue'),
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

      /**
       * Items. (Products/Services).
       * --------------------------------
       */
      {
        name: 'dashboard.items.list',
        path: '/items',
        component: () => import(/* webpackChunkName: "items_list" */
          '@/pages/Dashboard/Items/ItemsList.vue'),
        accessControl: { resource: 'items', permissions: ['view'] },
      },
      {
        name: 'dashboard.items.new',
        path: '/items/new',
        component: () => import(/* webpackChunkName: "items_form" */
          '@/pages/Dashboard/Items/ItemForm.vue'),
        accessControl: { resource: 'items', permissions: ['create'] },
      },

      /**
       * Accounts
       * ---------------------------
       */
      {
        name: 'dashboard.accounts.list',
        path: '/accounts/list',
        component: () => import(/* webpackChunkName: "accounts_list" */
          '@/pages/Dashboard/Accounts/AccountsList.vue'),
        accessControl: { resource: 'accounts', permissions: ['view'] },
      },

      /**
       * Users.
       * --------------------------------
       */
      {
        name: 'dashboard.users.list',
        path: '/users',
        component: () => import(/* webpackChunkName: "users_list" */
          '@/pages/Dashboard/Users/UsersList.vue'),
        accessControl: { resource: 'users', permissions: ['view'] },
      },
      {
        name: 'dasboard.user.new',
        path: '/users',
        component: () => import(/* webpackChunkName: "user_form" */
          '@/pages/Dashboard/Users/UserForm.vue'),
        accessControl: { resource: 'users', permissions: ['create'] },
      },
    ],
  },
];

export default routes;
