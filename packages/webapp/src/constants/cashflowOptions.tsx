import intl from 'react-intl-universal';
import type { MenuItemOption } from './types';

export const getAddMoneyInOptions = (): MenuItemOption[] => [
  {
    name: intl.get('banking.owner_contribution'),
    value: 'owner_contribution',
  },
  {
    name: intl.get('banking.other_income'),
    value: 'other_income',
  },
  {
    name: intl.get('banking.transfer_form_account'),
    value: 'transfer_from_account',
  },
];

export const getAddMoneyOutOptions = (): MenuItemOption[] => [
  {
    name: intl.get('banking.owner_drawings'),
    value: 'owner_drawing',
  },
  {
    name: intl.get('banking.expenses'),
    value: 'other_expense',
  },
  {
    name: intl.get('banking.transfer_to_account'),
    value: 'transfer_to_account',
  },
];

export const TRANSACTIONS_TYPE: string[] = [
  'OwnerContribution',
  'OtherIncome',
  'TransferFromAccount',
  'OwnerDrawing',
  'OtherExpense',
  'TransferToAccount',
];

export const MoneyCategoryPerCreditAccountRootType: Record<string, string[]> = {
  OwnerContribution: ['equity'],
  OtherIncome: ['income'],
  OwnerDrawing: ['equity'],
  OtherExpense: ['expense'],
  TransferToAccount: ['asset'],
  TransferFromAccount: ['asset'],
};
