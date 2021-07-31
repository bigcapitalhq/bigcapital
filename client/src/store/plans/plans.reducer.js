import React from 'react';
import { createReducer } from '@reduxjs/toolkit';
import intl from 'react-intl-universal';
import t from 'store/types';

const getSubscriptionPlans = () => [
  {
    name: intl.get('Starter'),
    slug: 'free',
    // slug: 'starter',
    description: [
      intl.get('Sale and purchase invoices.'),
      intl.get('Customers/vendors accounts.'),
      intl.get('Expenses tracking'),
      intl.get('Manual journals.'),
      intl.get('Financial reports.'),
      intl.get('For one user and accountant.'),
    ],
    price: {
      month: '100',
      year: '1,200',
    },
    currencyCode: 'LYD',
  },
  {
    name: intl.get('Essential'),
    slug: 'plus',
    description: [
      intl.get('All Capital Starter features.'),
      intl.get('Multi-currency.'),
      intl.get('Purchase and sell orders.'),
      intl.get('Inventory management.'),
      intl.get('Three users with your accountant.'),
      intl.get('Advanced financial reports.'),
    ],
    price: {
      month: '200',
      year: '2,400',
    },
    currencyCode: 'LYD',
  },
  {
    name: intl.get('Enterprise'),
    slug: 'enterprise',
    description: [
      intl.get('All Capital Essential features.'),
      intl.get('Track multi-branches and locations.'),
      intl.get('Projects accounting and timesheets.'),
      intl.get('Accounting dimensions.'),
    ],
    price: {
      month: '300',
      year: '3,400',
    },
    currencyCode: 'LYD',
  },
];

const getSubscriptionPeriods = () => [
  {
    slug: 'month',
    label: intl.get('Monthly'),
  },
  {
    slug: 'year',
    label: intl.get('Yearly'),
  },
];

const initialState = {
  plans: [],
  periods: [],
};

export default createReducer(initialState, {
  /**
   * Initialize the subscription plans.
   */
  [t.INIT_SUBSCRIPTION_PLANS]: (state) => {
    const plans = getSubscriptionPlans();
    const periods = getSubscriptionPeriods();

    state.plans = plans;
    state.periods = periods;
  },
});
