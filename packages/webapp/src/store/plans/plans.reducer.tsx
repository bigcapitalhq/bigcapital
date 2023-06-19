// @ts-nocheck
import { createReducer } from '@reduxjs/toolkit';
import intl from 'react-intl-universal';
import t from '@/store/types';

const getSubscriptionPeriods = () => [
  {
    slug: 'month',
    label: intl.get('plan.monthly'),
  },
  {
    slug: 'year',
    label: intl.get('plan.yearly'),
  },
];

const getSubscriptionPlans = () => [
  {
    name: intl.get('plan.capital_basic.title'),
    slug: 'capital_basic',
    description: [
      intl.get('plan.feature.sales_invoices'),
      intl.get('plan.feature.sales_estimates'),
      intl.get('plan.feature.customers'),
      intl.get('plan.feature.credit_notes'),
      intl.get('plan.feature.manual_journals'),
      intl.get('plan.feature.expenses_tracking'),
      intl.get('plan.feature.basic_financial_reports'),
    ],
    price: '55',
    periods: [
      {
        slug: 'month',
        label: intl.get('plan.monthly'),
        price: '55',
      },
      {
        slug: 'year',
        label: intl.get('plan.yearly'),
        price: '595',
      },
    ],
    currencyCode: 'LYD',
  },
  {
    name: intl.get('plan.capital_plus.title'),
    slug: 'capital_plus',
    description: [
      intl.get('plan.feature.all_capital_basic'),
      intl.get('plan.feature.predefined_user_roles'),
      intl.get('plan.feature.custom_tables_views'),
      intl.get('plan.feature.transactions_locking'),
      intl.get('plan.feature.plus_financial_reports'),
      intl.get('plan.feature.custom_fields_resources'),
    ],
    price: '75',
    periods: [
      {
        slug: 'month',
        label: intl.get('plan.monthly'),
        price: '75',
      },
      {
        slug: 'year',
        label: intl.get('plan.yearly'),
        price: '795',
      },
    ],
    currencyCode: 'LYD',
  },
  {
    name: intl.get('plan.essential.title'),
    slug: 'essentials',
    description: [
      intl.get('plan.feature.all_capital_plus'),
      intl.get('plan.feature.sales_purchases_order'),
      intl.get('plan.feature.purchase_invoices'),
      intl.get('plan.feature.inventory_tracking'),
      intl.get('plan.feature.custom_roles'),
      intl.get('plan.feature.multiply_currency_transactions'),
      intl.get('plan.feature.inventory_reports'),
      intl.get('plan.feature.landed_cost'),
    ],
    price: '95',
    periods: [
      {
        slug: 'month',
        label: intl.get('plan.monthly'),
        price: '95',
      },
      {
        slug: 'year',
        label: intl.get('plan.yearly'),
        price: '995',
      },
    ],
    currencyCode: 'LYD',
  },
  {
    name: intl.get('plan.capital_enterprise.title'),
    slug: 'enterprise',
    description: [
      intl.get('plan.feature.all_capital_essential'),
      intl.get('plan.feature.multiply_branches'),
      intl.get('plan.feature.multiply_warehouses'),
      intl.get('plan.feature.accounting_dimensions'),
      intl.get('plan.feature.warehouses_reports'),
      intl.get('plan.feature.branches_reports'),
    ],
    price: '120',
    currencyCode: 'LYD',
    periods: [
      {
        slug: 'month',
        label: intl.get('plan.monthly'),
        price: '120',
      },
      {
        slug: 'year',
        label: intl.get('plan.yearly'),
        price: '1,195',
      },
    ],
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
