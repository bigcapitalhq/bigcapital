import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  plans: [
    {
      name: 'Free',
      slug: 'free',
      description: [
        'Sales/purchases module.',
        'Expense module.',
        'Inventory module.',
        'Unlimited status pages.',
        'Unlimited status pages.',
      ],
      price: {
        month: '100',
        year: '1200',
      },
      currencyCode: 'LYD',
    },
    {
      name: 'Pro',
      slug: 'pro',
      description: [
        'Sales/purchases module.',
        'Expense module.',
        'Inventory module.',
        'Unlimited status pages.',
        'Unlimited status pages.',
      ],
      price: {
        month: '200',
        year: '2400',
      },
      currencyCode: 'LYD',
    },
  ],
  periods: [
    {
      slug: 'month',
      label: 'Monthly',
    },
    {
      slug: 'year',
      label: 'Yearly',
    },
  ],
};

export default createReducer(initialState, {

});
