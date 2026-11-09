import { lazy } from 'react';
import type { ComponentType } from 'react';

const CustomerDeleteAlert = lazy(() =>
  import('@/containers/Alerts/Customers/CustomerDeleteAlert').then((m) => ({
    default: m.CustomerDeleteAlert,
  })),
);
const CustomerActivateAlert = lazy(() =>
  import('@/containers/Alerts/Customers/CustomerActivateAlert').then((m) => ({
    default: m.CustomerActivateAlert,
  })),
);
const CustomerInactivateAlert = lazy(() =>
  import('@/containers/Alerts/Customers/CustomerInactivateAlert').then((m) => ({
    default: m.CustomerInactivateAlert,
  })),
);

export interface CustomerAlertConfig {
  name: string;
  component: ComponentType<{ name: string }>;
}

/**
 * Customers alert.
 */
export const CustomersAlerts: CustomerAlertConfig[] = [
  { name: 'customer-delete', component: CustomerDeleteAlert },
  { name: 'customer-activate', component: CustomerActivateAlert },
  { name: 'customer-inactivate', component: CustomerInactivateAlert },
];
