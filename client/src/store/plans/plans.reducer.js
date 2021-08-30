import { createReducer } from '@reduxjs/toolkit';
import intl from 'react-intl-universal';
import t from 'store/types';


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
    name: intl.get('plan.essential.title'),
    slug: 'free',
    description: [
      intl.get('plan.feature.sale_purchase_invoice'),
      intl.get('plan.feature.receivable_payable_accounts'),
      intl.get('plan.feature.expenses_tracking'),
      intl.get('plan.feature.manual_journal'),
      intl.get('plan.feature.financial_reports'),
      intl.get('plan.feature.one_user_with_accountant'),
    ],
    price: '100',
    periods: [
      {
        slug: 'month',
        label: intl.get('plan.monthly'),
        price: '100'
      },
      {
        slug: 'year',
        label: intl.get('plan.yearly'),
        price: '1,200',
      },
    ],
    currencyCode: 'LYD',
  },
  {
    name: intl.get('plan.professional.title'),
    slug: 'plus',
    description: [
      intl.get('plan.feature.all_capital_essential'),
      intl.get('plan.feature.multi_currency'),
      intl.get('plan.feature.purchase_sell_orders'),
      intl.get('plan.feature.multi_inventory_managment'),
      intl.get('plan.feature.three_users'),
      intl.get('plan.feature.advanced_financial_reports'),
    ],
    price: '200',
    currencyCode: 'LYD',
    periods: [
      {
        slug: 'month',
        label: intl.get('plan.monthly'),
        price: '200'
      },
      {
        slug: 'year',
        label: intl.get('plan.yearly'),
        price: '1,200',
      },
    ],
  },
  {
    name: intl.get('plan.plus.title'),
    slug: 'enterprise',
    description: [
      intl.get('plan.feture.all_capital_professional_features'),
      intl.get('plan.feature.tracking_multi_locations'),
      intl.get('plan.feature.projects_accounting'),
      intl.get('plan.feature.accounting_dimensions'),
    ],
    price: '300',
    currencyCode: 'LYD',
    periods: [
      {
        slug: 'month',
        label: intl.get('plan.monthly'),
        price: '300'
      },
      {
        slug: 'year',
        label: intl.get('plan.yearly'),
        price: '1,200',
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
