import React from 'react';
import { FormattedMessage as T } from 'components';

export default [
  {
    text: <T id={'homepage'} />,
    disabled: false,
    href: '/',
    matchExact: true,
  },
  {
    text: <T id={'sales_inventory'} />,
    label: true,
  },
  {
    text: <T id={'items'} />,
    children: [
      {
        text: <T id={'items'} />,
        href: '/items',
      },
      {
        text: <T id={'inventory_adjustments'} />,
        href: '/inventory-adjustments',
      },
      {
        text: <T id={'category_list'} />,
        href: '/items/categories',
      },
      {
        text: 'New tasks',
        label: true,
      },
      {
        divider: true,
      },
      {
        text: <T id={'New inventory item'} />,
        href: '/items/new',
      },
      {
        text: <T id={'New service'} />,
        href: '/items/new',
      },
      {
        text: <T id={'New item category'} />,
        href: '/items/categories/new',
      },
      {
        text: 'New inventory adjustment',
      },
    ],
  },
  {
    text: <T id={'sales'} />,
    children: [
      {
        text: <T id={'estimates'} />,
        href: '/estimates',
        newTabHref: '/estimates/new',
      },
      {
        text: <T id={'invoices'} />,
        href: '/invoices',
        newTabHref: '/invoices/new',
      },

      {
        text: <T id={'payment_receives'} />,
        href: '/payment-receives',
        newTabHref: '/payment-receives/new',
      },
      {
        text: <T id={'receipts'} />,
        href: '/receipts',
        newTabHref: '/receipts/new',
      },
      {
        text: 'New tasks',
        label: true,
      },
      {
        divider: true,
      },
      {
        text: <T id={'new_estimate'} />,
        href: '/estimates/new',
      },
      {
        text: <T id={'new_invoice'} />,
        href: '/invoices/new',
      },
      {
        text: <T id={'new_receipt'} />,
        href: '/receipts/new',
      },
      {
        text: <T id={'new_payment_receive'} />,
        href: '/payment-receives/new',
      },
    ],
  },
  {
    text: <T id={'purchases'} />,
    children: [
      {
        text: <T id={'bills'} />,
        href: '/bills',
        newTabHref: '/bills/new',
      },
      {
        text: <T id={'payment_mades'} />,
        href: '/payment-mades',
        newTabHref: '/payment-mades/new',
      },
      {
        text: 'New tasks',
        label: true,
      },
      {
        divider: true,
      },
      {
        text: <T id={'New purchase invoice'} />,
        href: '/bills/new',
      },
      {
        text: <T id={'new_payment_made'} />,
        href: '/payment-mades/new',
      },
    ],
  },
  {
    text: <T id={'contacts'} />,
    children: [
      {
        text: <T id={'customers'} />,
        href: '/customers',
        newTabHref: '/customers/new',
      },
      {
        text: <T id={'vendors'} />,
        href: '/vendors',
        newTabHref: '/vendors/new',
      },
      {
        text: 'New tasks',
        label: true,
      },
      {
        divider: true,
      },
      {
        text: <T id={'new_customer'} />,
        href: '/customers/new',
      },
      {
        text: <T id={'new_vendor'} />,
        href: '/vendors/new',
      },
    ],
  },
  {
    text: <T id={'accounting'} />,
    label: true,
  },
  {
    text: <T id={'financial'} />,
    children: [
      {
        text: <T id={'accounts_chart'} />,
        href: '/accounts',
      },
      {
        text: <T id={'manual_journals'} />,
        href: '/manual-journals',
      },
      {
        text: <T id={'exchange_rate'} />,
        href: '/exchange-rates',
      },
      {
        text: 'New tasks',
        label: true,
      },
      {
        divider: true,
      },
      {
        text: <T id={'make_journal_entry'} />,
        href: '/make-journal-entry',
      },
    ],
  },
  {
    text: <T id={'banking'} />,
    children: [],
  },
  {
    text: <T id={'expenses'} />,
    children: [
      {
        text: <T id={'expenses'} />,
        href: '/expenses',
      },
      {
        text: 'New tasks',
        label: true,
      },
      {
        divider: true,
      },
      {
        text: <T id={'new_expense'} />,
        href: '/expenses/new',
      },
    ],
  },
  {
    text: <T id={'financial_reports'} />,
    children: [
      {
        text: <T id={'balance_sheet'} />,
        href: '/financial-reports/balance-sheet',
      },
      {
        text: <T id={'trial_balance_sheet'} />,
        href: '/financial-reports/trial-balance-sheet',
      },
      {
        text: <T id={'journal'} />,
        href: '/financial-reports/journal-sheet',
      },
      {
        text: <T id={'general_ledger'} />,
        href: '/financial-reports/general-ledger',
      },
      {
        text: <T id={'profit_loss_sheet'} />,
        href: '/financial-reports/profit-loss-sheet',
      },
      {
        text: <T id={'cash_flow_statement'} />,
        href: '/financial-reports/cash-flow',
      },
      {
        text: <T id={'AR_Aging_Summary'} />,
        href: '/financial-reports/receivable-aging-summary',
      },
      {
        text: <T id={'AP_Aging_Summary'} />,
        href: '/financial-reports/payable-aging-summary',
      },
      {
        text: <T id={'Sales/Purchases'} />,
        label: true,
      },
      {
        divider: true,
      },
      {
        text: <T id={'purchases_by_items'} />,
        href: '/financial-reports/purchases-by-items',
      },
      {
        text: <T id={'sales_by_items'} />,
        href: '/financial-reports/sales-by-items',
      },
      {
        text: <T id={'customers_transactions'} />,
        href: '/financial-reports/transactions-by-customers',
      },
      {
        text: <T id={'vendors_transactions'} />,
        href: '/financial-reports/transactions-by-vendors',
      },
      {
        text: <T id={'customers_balance_summary'} />,
        href: '/financial-reports/customers-balance-summary',
      },
      {
        text: <T id={'vendors_balance_summary'} />,
        href: '/financial-reports/vendors-balance-summary',
      },
      {
        text: <T id={'inventory'} />,
        label: true,
      },
      {
        divider: true,
      },
      {
        text: <T id={'inventory_item_details'} />,
        href: '/financial-reports/inventory-item-details',
      },
      {
        text: <T id={'inventory_valuation'} />,
        href: '/financial-reports/inventory-valuation',
      },
    ],
  },
  {
    text: <T id={'system'} />,
    label: true,
  },
  {
    text: <T id={'preferences'} />,
    href: '/preferences',
  },
  {
    text: <T id={'billing'} />,
    href: '/billing',
  },
  {
    text: <T id={'auditing_system'} />,
    href: '/auditing/list',
  },
];
