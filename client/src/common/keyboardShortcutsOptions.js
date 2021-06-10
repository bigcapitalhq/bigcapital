import React from 'react';
import intl from 'react-intl-universal';

export default [
  {
    shortcut_key: 'Shift + I',
    description: intl.get('jump_to_the_invoices'),
  },
  {
    shortcut_key: 'Shift + E',
    description: intl.get('jump_to_the_estimates'),
  },
  {
    shortcut_key: 'Shift + R',
    description: intl.get('jump_to_the_receipts'),
  },
  {
    shortcut_key: 'Shift + X',
    description: intl.get('jump_to_the_expenses'),
  },
  {
    shortcut_key: 'Shift + C',
    description: intl.get('jump_to_the_customers'),
  },
  {
    shortcut_key: 'Shift + V',
    description: intl.get('jump_to_the_vendors'),
  },
  {
    shortcut_key: 'Shift + A',
    description: intl.get('jump_to_the_chart_of_accounts'),
  },
  {
    shortcut_key: 'Shift + B',
    description: intl.get('jump_to_the_bills'),
  },
  {
    shortcut_key: 'Shift + M',
    description: intl.get('jump_to_the_manual_journals'),
  },
  {
    shortcut_key: 'Shift + W',
    description: intl.get('jump_to_the_items'),
  },
  {
    shortcut_key: 'Shift + 1',
    description: intl.get('jump_to_the_balance_sheet'),
  },
  {
    shortcut_key: 'Shift + 2',
    description: intl.get('jump_to_the_profit_loss_sheet'),
  },
  {
    shortcut_key: 'Shift + 3',
    description: intl.get('jump_to_the_journal_sheet'),
  },
  {
    shortcut_key: 'Shift + 4',
    description: intl.get('jump_to_the_general_ledger_sheet'),
  },
  {
    shortcut_key: 'Shift + 5',
    description: intl.get('jump_to_the_trial_balance_sheet'),
  },
  {
    shortcut_key: 'Ctrl + Shift  + I ',
    description: intl.get('create_a_new_invoice'),
  },
  {
    shortcut_key: 'Ctrl + Shift  + E ',
    description: intl.get('create_a_new_estimate'),
  },
  {
    shortcut_key: 'Ctrl + Shift  + R ',
    description: intl.get('create_a_new_receipt'),
  },
  {
    shortcut_key: 'Ctrl + Shift  + X ',
    description: intl.get('create_a_new_expense'),
  },
  {
    shortcut_key: 'Ctrl + Shift  + C ',
    description: intl.get('create_a_new_customer'),
  },
  {
    shortcut_key: 'Ctrl + Shift  + V ',
    description: intl.get('create_a_new_vendor'),
  },
  {
    shortcut_key: 'Ctrl + Shift  + B ',
    description: intl.get('create_a_new_bill'),
  },
  {
    shortcut_key: 'Ctrl + Shift  + M ',
    description: intl.get('create_a_new_make_journal'),
  },
  {
    shortcut_key: 'Ctrl + Shift  + W ',
    description: intl.get('create_a_new_item'),
  },
  {
    shortcut_key: 'Ctrl + / ',
    description: intl.get('close_and_open_sidebar'),
  },
];
