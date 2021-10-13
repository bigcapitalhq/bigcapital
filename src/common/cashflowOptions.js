import intl from 'react-intl-universal';

export const addMoneyIn = [
  {
    name: intl.get('cash_flow.option_owner_contribution'),
    type: 'OWNERS',
  },
  {
    name: intl.get('cash_flow.option_other_income'),
    type: 'EQUITY',
  },
];

export const addMoneyOut = [
  {
    name: intl.get('cash_flow.option_owner_drawings'),
    type: 'OWNERS',
  },
  {
    name: intl.get('cash_flow.option_expenses'),
    type: 'EXPENSES',
  },
  {
    name: intl.get('cash_flow.option_vendor_payment'),
    type: '',
  },
];
