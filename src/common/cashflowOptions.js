import intl from 'react-intl-universal';

export const addMoneyIn = [
  {
    name: intl.get('cash_flow.option_owner_contribution'),
    type: 'OWNER_CONTRIBUTION',
  },
  {
    name: intl.get('cash_flow.option_other_income'),
    type: 'OTHER_INCOME',
  },
  {
    name: intl.get('cash_flow.option_transfer_form_account'),
    type: 'TRANSFER_FROM_ACCOUNT',
  },
];

export const addMoneyOut = [
  {
    name: intl.get('cash_flow.option_owner_drawings'),
    type: 'ONWERS_DRAWING',
  },
  {
    name: intl.get('cash_flow.option_expenses'),
    type: 'OTHER_EXPENSE',
  },
  {
    name: intl.get('cash_flow.option_transfer_to_account'),
    type: 'TRANSFER_TO_ACCOUNT',
  },
];
