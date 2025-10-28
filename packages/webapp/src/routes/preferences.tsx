// @ts-nocheck
import { lazy } from 'react';

const BASE_URL = '/preferences';

export const getPreferenceRoutes = () => [
  {
    path: `${BASE_URL}/general`,
    component: lazy(() => import('@/containers/Preferences/General/General')),
    exact: true,
  },
  {
    path: `${BASE_URL}/branding`,
    component: lazy(() => import('../containers/Preferences/Branding/PreferencesBrandingPage')),
    exact: true,
  },
  {
    path: `${BASE_URL}/users`,
    component: lazy(() => import('../containers/Preferences/Users/Users')),
    exact: true,
  },
  {
    path: `${BASE_URL}/invoices`,
    component: lazy(
      () => import('../containers/Preferences/Invoices/PreferencesInvoices'),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/payment-methods`,
    component: lazy(
      () => import('../containers/Preferences/PaymentMethods/PreferencesPaymentMethodsPage'),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/payment-methods/stripe/callback`,
    component: lazy(
      () => import('../containers/Preferences/PaymentMethods/PreferencesStripeCallback'),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/credit-notes`,
    component: lazy(() =>
      import(
        '../containers/Preferences/CreditNotes/PreferencesCreditNotes'
      ).then((module) => ({ default: module.PreferencesCreditNotes })),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/estimates`,
    component: lazy(() =>
      import('@/containers/Preferences/Estimates/PreferencesEstimates').then(
        (module) => ({ default: module.PreferencesEstimates }),
      ),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/receipts`,
    component: lazy(() =>
      import('@/containers/Preferences/Receipts/PreferencesReceipts').then(
        (module) => ({ default: module.PreferencesReceipts }),
      ),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/roles`,
    component: lazy(
      () =>
        import('../containers/Preferences/Users/Roles/RolesForm/RolesFormPage'),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/roles/:id`,
    component: lazy(
      () =>
        import('../containers/Preferences/Users/Roles/RolesForm/RolesFormPage'),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/currencies`,
    component: lazy(
      () => import('@/containers/Preferences/Currencies/Currencies'),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/warehouses`,
    component: lazy(() => import('../containers/Preferences/Warehouses')),
    exact: true,
  },
  {
    path: `${BASE_URL}/branches`,
    component: lazy(() => import('../containers/Preferences/Branches')),
    exact: true,
  },
  {
    path: `${BASE_URL}/accountant`,
    component: lazy(
      () => import('@/containers/Preferences/Accountant/Accountant'),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/items`,
    component: lazy(() => import('@/containers/Preferences/Item')),
    exact: true,
  },
  // {
  //   path: `${BASE_URL}/sms-message`,
  //   component: SMSIntegration,
  //   exact: true,
  // },
  {
    path: `${BASE_URL}/billing`,
    component: lazy(() => import('@/containers/Subscriptions/BillingPage')),
    exact: true,
  },
  {
    path: `${BASE_URL}/`,
    component: lazy(() => import('../containers/Preferences/DefaultRoute')),
    exact: true,
  },
];
