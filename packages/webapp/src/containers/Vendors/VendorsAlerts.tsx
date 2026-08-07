import { lazy } from 'react';
import type { ComponentType } from 'react';

const VendorDeleteAlert = lazy(() =>
  import('@/containers/Alerts/Vendors/VendorDeleteAlert').then((m) => ({
    default: m.VendorDeleteAlert,
  })),
);
const VendorActivateAlert = lazy(() =>
  import('@/containers/Alerts/Vendors/VendorActivateAlert').then((m) => ({
    default: m.VendorActivateAlert,
  })),
);
const VendorInactivateAlert = lazy(() =>
  import('@/containers/Alerts/Vendors/VendorInactivateAlert').then((m) => ({
    default: m.VendorInactivateAlert,
  })),
);

export interface VendorAlertConfig {
  name: string;
  component: ComponentType<{ name: string }>;
}

export const VendorsAlerts: VendorAlertConfig[] = [
  { name: 'vendor-delete', component: VendorDeleteAlert },
  { name: 'vendor-activate', component: VendorActivateAlert },
  { name: 'vendor-inactivate', component: VendorInactivateAlert },
];
