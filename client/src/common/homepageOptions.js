import React from 'react';
import { FormattedMessage as T } from 'react-intl';

export const accountsReceivable = [
  {
    sectionTitle: <T id={'accounts_receivable_a_r'} />,
    shortcuts: [
      {
        title: 'Sales invoices',
        description:
          'Labore aute elit proident sit culpa. Commodo nulla veniam ullamco ullamco ut nulla pariatur eu. Esse tempor irure incididunt veniam sint excepteur quis.',
        link: '/invoices',
      },
      {
        title: 'Sales estimates',
        description:
          'Labore aute elit proident sit culpa. Commodo nulla veniam ullamco ullamco ut nulla pariatur eu. Esse tempor irure incididunt veniam sint excepteur quis.',

        link: '/estimates',
      },
      {
        title: 'Sales receipts',
        description:
          'Labore aute elit proident sit culpa. Commodo nulla veniam ullamco ullamco ut nulla pariatur eu. Esse tempor irure incididunt veniam sint excepteur quis.',

        link: '/receipts',
      },
      {
        title: 'Customers',
        description:
          'Labore aute elit proident sit culpa. Commodo nulla veniam ullamco ullamco ut nulla pariatur eu. Esse tempor irure incididunt veniam sint excepteur quis.',

        link: '/customers',
      },
      {
        title: 'Customers payment',
        description:
          'Labore aute elit proident sit culpa. Commodo nulla veniam ullamco ullamco ut nulla pariatur eu. Esse tempor irure incididunt veniam sint excepteur quis.',
        link: '/payment-receives',
      },
    ],
  },
];

export const accountsPayable = [
  {
    sectionTitle: <T id={'accounts_payable_a_p'} />,
    shortcuts: [
      {
        title: 'Purchase invoices',
        description:
          'Labore aute elit proident sit culpa. Commodo nulla veniam ullamco ullamco ut nulla pariatur eu. Esse tempor irure incididunt veniam sint excepteur quis.',

        link: '/bills',
      },
      {
        title: 'Vendors',
        description:
          'Labore aute elit proident sit culpa. Commodo nulla veniam ullamco ullamco ut nulla pariatur eu. Esse tempor irure incididunt veniam sint excepteur quis.',
        link: '/vendors',
      },
      {
        title: 'Vendors payments',
        description:
          'Labore aute elit proident sit culpa. Commodo nulla veniam ullamco ullamco ut nulla pariatur eu. Esse tempor irure incididunt veniam sint excepteur quis.',

        link: '/payment-mades',
      },
    ],
  },
];

export const financialAccounting = [
  {
    sectionTitle: <T id={'financial_accounting'} />,
    shortcuts: [
      {
        title: 'Chart of accounts',
        description:
          'Labore aute elit proident sit culpa. Commodo nulla veniam ullamco ullamco ut nulla pariatur eu. Esse tempor irure incididunt veniam sint excepteur quis.',

        link: '/accounts',
      },
      {
        title: 'Manual journal',
        description:
          'Labore aute elit proident sit culpa. Commodo nulla veniam ullamco ullamco ut nulla pariatur eu. Esse tempor irure incididunt veniam sint excepteur quis.',
        link: '/manual-journals',
      },
      {
        title: 'Expenses',
        description:
          'Labore aute elit proident sit culpa. Commodo nulla veniam ullamco ullamco ut nulla pariatur eu. Esse tempor irure incididunt veniam sint excepteur quis.',
        link: '/expenses',
      },
      {
        title: 'Financial statements',
        description:
          'Labore aute elit proident sit culpa. Commodo nulla veniam ullamco ullamco ut nulla pariatur eu. Esse tempor irure incididunt veniam sint excepteur quis.',
        link: '/financial-reports',
      },
    ],
  },
];

export const productsServices = [
  {
    sectionTitle: <T id={'products_services_inventory'} />,
    shortcuts: [
      {
        title: 'Products & Services',
        description:
          'Labore aute elit proident sit culpa. Commodo nulla veniam ullamco ullamco ut nulla pariatur eu. Esse tempor irure incididunt veniam sint excepteur quis.',
        link: '/items',
      },
      {
        title: 'Products & Services Categories',
        description:
          'Labore aute elit proident sit culpa. Commodo nulla veniam ullamco ullamco ut nulla pariatur eu. Esse tempor irure incididunt veniam sint excepteur quis.',
        link: 'items/categories',
      },
      {
        title: 'Inventory Adjustments',
        description:
          'Labore aute elit proident sit culpa. Commodo nulla veniam ullamco ullamco ut nulla pariatur eu. Esse tempor irure incididunt veniam sint excepteur quis.',
        link: '/inventory-adjustments',
      },
    ],
  },
];
