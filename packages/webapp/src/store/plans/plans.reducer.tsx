// @ts-nocheck
import { createReducer } from '@reduxjs/toolkit';
import t from '@/store/types';

const getSubscriptionPlans = () => [
  {
    name: 'Capital Basic',
    slug: 'capital_basic',
    description: 'Good for service businesses that just started.',
    features: [
      'Sale Invoices and Estimates',
      'Tracking Expenses',
      'Customize Invoice',
      'Manual Journals',
      'Bank Reconciliation',
      'Chart of Accounts',
      'Taxes',
      'Basic Financial Reports & Insights',
    ],
    price: '$29',
    pricePeriod: 'Per Year',
  },
  {
    name: 'Capital Plus',
    slug: 'capital_plus',
    description:
      'Good for businesses have inventory and want more financial reports.',
    features: [
      'All Capital Basic features',
      'Manage Bills',
      'Inventory Tracking',
      'Multi Currencies',
      'Predefined user roles.',
      'Transactions locking.',
      'Smart Financial Reports.',
    ],
    price: '$29',
    pricePeriod: 'Per Year',
    featured: true,
  },
  {
    name: 'Capital Big',
    slug: 'essentials',
    description: 'Good for businesses have multiple inventory or branches.',
    features: [
      'All Capital Plus features',
      'Multiple Warehouses',
      'Multiple Branches',
      'Invite >= 15 Users',
    ],
    price: '$29',
    pricePeriod: 'Per Year',
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

    state.plans = plans;
  },
});
