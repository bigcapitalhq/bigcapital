import type { BigcapitalWebExtension } from '@bigcapital/extension-sdk/web';
import { exampleReportsManifest } from '../manifest';
import { DashboardWidget } from './DashboardWidget';
import { ReportsPage } from './ReportsPage';

export const extension: BigcapitalWebExtension = {
  manifest: exampleReportsManifest,

  routes: [
    {
      id: 'reports',
      path: 'reports',
      component: ReportsPage,
      pageTitle: 'Example Reports',
    },
  ],

  menu: [
    {
      id: 'example-reports',
      text: { i18n: 'example_reports' },
      href: 'reports',
      parentId: 'reports',
    },
  ],

  slots: [
    {
      id: 'example-reports-widget',
      slot: 'dashboard.widgets',
      component: DashboardWidget,
    },
  ],

  i18n: {
    en: {
      example_reports: 'Example Reports',
    },
  },
};
