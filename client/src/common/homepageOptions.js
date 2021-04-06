import React from 'react';
import { FormattedMessage as T } from 'react-intl';

export const accountsReceivable = [
  {
    sectionTitle: <T id={'accounts_receivable_a_r'} />,
    shortcuts: [
      {
        title: 'Sales invoices',
        description: 'Tracking sales invoices with your customers with payment due date.',
        link: '/invoices',
      },
      {
        title: 'Sales estimates',
        description:
          'Manage your sales estimates to create quotes that can later be turned to a sale invoice.',

        link: '/estimates',
      },
      {
        title: 'Sales receipts',
        description:
          'Manage sales receipts for sales that get paid immediately from the customer.',

        link: '/receipts',
      },
      {
        title: 'Customers',
        description: 'Manage the customers relations with customer receivable and credit balances.',
        link: '/customers',
      },
      {
        title: 'Customers payment',
        description:
          'Manage payment transactions from your customers with sale invoices.',
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
        description: 'Manage the purchase invoices with your vendors with payment due date.',
        link: '/bills',
      },
      {
        title: 'Vendors',
        description: 'Manage the vendors relations with vendor payable and debit balances.',
        link: '/vendors',
      },
      {
        title: 'Vendors payments',
        description:
          'Manage payments transactions to your vendors with purchase invoices.',

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
          'Manage your accounts chart to record your transactions and categorise your transactions in parent accounts.',
        link: '/accounts',
      },
      {
        title: 'Manual journal',
        description: 'Manage manual journal transactions on accounts, cost centra and projects.',
        link: '/manual-journals',
      },
      {
        title: 'Expenses',
        description:
          'Track your indirect expenses under specific categories such as payroll, rent.',
        link: '/expenses',
      },
      {
        title: 'Financial statements',
        description:
          'Show financial reports about your organization to summarize your business’s financial performance.',
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
          'Manage your products (inventory or non-inventory) and services and place them into categories.',
        link: '/items',
      },
      {
        title: 'Products & Services Categories',
        description:
          'Group your products and service into different categories.',
        link: 'items/categories',
      },
      {
        title: 'Inventory Adjustments',
        description: 'Manage your inventory adjustment of inventory items.',
        link: '/inventory-adjustments',
      },
    ],
  },
];
