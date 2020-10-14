import LazyLoader from 'components/LazyLoader';

export default [
  
  {
    path: '/register/subscription',
    component: LazyLoader({
      loader: () => import('containers/Authentication/Register/RegisterSubscriptionForm'),
    }),
  },
  {
    path: '/register/organization',
    component: LazyLoader({
      loader: () => import('containers/Authentication/Register/RegisterOrganizationForm'),
    }),
  },
  {
    path: `/`,
    component: LazyLoader({
      loader: () => import('containers/Authentication/Register/RegisterUserForm'),
    }),
  },
];
