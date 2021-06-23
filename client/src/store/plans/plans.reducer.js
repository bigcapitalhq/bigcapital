import React from 'react';
import { createReducer } from '@reduxjs/toolkit';
import { FormattedMessage as T } from 'components';

const initialState = {
  plans: [
    {
      name: 'Free',
      slug: 'free',
      description: [
        <T id={'sale_and_purchase_invoices'} />,
        <T id={'customers_vendors_accounts'} />,
        <T id={'expense_tracking'} />,
        <T id={'manual_journals'} />,
        <T id={'financial_reports'} />,
        <T id={'for_one_user_and_accountant'} />,
      ],
      price: {
        month: '100',
        year: '1200',
      },
      currencyCode: 'LYD',
    },
    {
      name: 'Plus',
      slug: 'plus',
      description: [
        <T id={'all_capital_starter_features'} />,
        <T id={'multi_currency'} />,
        <T id={'purchase_and_sell_orders'} />,
        <T id={'inventory_management'} />,
        <T id={'three_users_with_your_accountant'} />,
        <T id={'advanced_financial_reports'} />,
      ],
      price: {
        month: '200',
        year: '2400',
      },
      currencyCode: 'LYD',
    },
    {
      name: 'Enterprise',
      slug: 'enterprise',
      description: [
        <T id={'all_capital_essential_features'} />,
        <T id={'track_multi_branches_and_locations'} />,
        <T id={'projects_accounting_and_timesheets'} />,
        <T id={'accounting_dimensions'} />,
      ],
      price: {
        month: '300',
        year: '3,400',
      },
      currencyCode: 'LYD',
    },
  ],
  periods: [
    {
      slug: 'month',
      label: <T id={'monthly'}/>
    },
    {
      slug: 'year',
      label: <T id={'yearly'}/>
    },
  ],
};

export default createReducer(initialState, {});
