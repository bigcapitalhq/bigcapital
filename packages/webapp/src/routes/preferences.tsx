// @ts-nocheck
import { lazy } from 'react';

const BASE_URL = '/preferences';

export const getPreferenceRoutes = () => [
  {
    path: `${BASE_URL}/general`,
    component: lazy(() =>
      import('@/containers/Preferences/General/General').then((m) => ({
        default: m.GeneralPreferences,
      })),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/branding`,
    component: lazy(() =>
      import('../containers/Preferences/Branding/PreferencesBrandingPage').then(
        (m) => ({ default: m.PreferencesBrandingPage }),
      ),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/users`,
    component: lazy(() =>
      import('../containers/Preferences/Users/Users').then((m) => ({
        default: m.Users,
      })),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/invoices`,
    component: lazy(() =>
      import('../containers/Preferences/Invoices/PreferencesInvoices').then(
        (m) => ({ default: m.PreferencesInvoices }),
      ),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/payment-methods`,
    component: lazy(() =>
      import(
        '../containers/Preferences/PaymentMethods/PreferencesPaymentMethodsPage'
      ).then((m) => ({ default: m.PreferencesPaymentMethodsPage })),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/payment-methods/stripe/callback`,
    component: lazy(() =>
      import(
        '../containers/Preferences/PaymentMethods/PreferencesStripeCallback'
      ).then((m) => ({ default: m.PreferencesStripeCallback })),
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
    component: lazy(() =>
      import(
        '../containers/Preferences/Users/Roles/RolesForm/RolesFormPage'
      ).then((m) => ({ default: m.RolesFormPage })),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/roles/:id`,
    component: lazy(() =>
      import(
        '../containers/Preferences/Users/Roles/RolesForm/RolesFormPage'
      ).then((m) => ({ default: m.RolesFormPage })),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/currencies`,
    component: lazy(() =>
      import('@/containers/Preferences/Currencies/Currencies').then((m) => ({
        default: m.PreferencesCurrenciesPage,
      })),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/warehouses`,
    component: lazy(() =>
      import('../containers/Preferences/Warehouses').then((m) => ({
        default: m.WarehousesPerences,
      })),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/branches`,
    component: lazy(() =>
      import('../containers/Preferences/Branches').then((m) => ({
        default: m.BranchesPreferences,
      })),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/accountant`,
    component: lazy(() =>
      import('@/containers/Preferences/Accountant/Accountant').then((m) => ({
        default: m.AccountantPreferences,
      })),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/items`,
    component: lazy(() =>
      import('@/containers/Preferences/Item').then((m) => ({
        default: m.ItemsPreferences,
      })),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/features`,
    component: lazy(() =>
      import('@/containers/Preferences/Features/Features').then((m) => ({
        default: m.FeaturesPreferences,
      })),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/api-keys`,
    component: lazy(() =>
      import('@/containers/Preferences/ApiKeys/ApiKeys').then((m) => ({
        default: m.ApiKeys,
      })),
    ),
    exact: true,
  },
  {
    path: `${BASE_URL}/`,
    component: lazy(() =>
      import('../containers/Preferences/DefaultRoute').then((m) => ({
        default: m.DefaultRoute,
      })),
    ),
    exact: true,
  },
];
