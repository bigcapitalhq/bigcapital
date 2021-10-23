import intl from 'react-intl-universal';

export const addMoneyIn = [
  {
    name: intl.get('cash_flow.option_owner_contribution'),
    value: 'owner_contribution',
  },
  {
    name: intl.get('cash_flow.option_other_income'),
    type: 'OTHER_INCOME',
    value: 'other_income',
  },
  {
    name: intl.get('cash_flow.option_transfer_form_account'),
    value: 'transfer_from_account',
  },
];

export const addMoneyOut = [
  {
    name: intl.get('cash_flow.option_owner_drawings'),
    value: 'onwers_drawing',
  },
  {
    name: intl.get('cash_flow.option_expenses'),
    value: 'other_expense',
  },
  {
    name: intl.get('cash_flow.option_transfer_to_account'),
    value: 'transfer_to_account',
  },
];
