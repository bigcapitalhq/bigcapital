// @ts-nocheck
import intl from 'react-intl-universal';

export const getAddMoneyInOptions = () => [
  {
    name: intl.get('cash_flow.owner_contribution'),
    value: 'owner_contribution',
  },
  {
    name: intl.get('cash_flow.other_income'),
    value: 'other_income',
  },
  {
    name: intl.get('cash_flow.transfer_form_account'),
    value: 'transfer_from_account',
  },
];

export const getAddMoneyOutOptions = () => [
  {
    name: intl.get('cash_flow.owner_drawings'),
    value: 'OwnerDrawing',
  },
  {
    name: intl.get('cash_flow.expenses'),
    value: 'other_expense',
  },
  {
    name: intl.get('cash_flow.transfer_to_account'),
    value: 'transfer_to_account',
  },
];

export const TRANSACRIONS_TYPE = [
  'OwnerContribution',
  'OtherIncome',
  'TransferFromAccount',
  'OwnersDrawing',
  'OtherExpense',
  'TransferToAccount',
];
