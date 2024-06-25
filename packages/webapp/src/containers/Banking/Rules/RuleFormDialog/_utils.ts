export const initialValues = {
  name: '',
  order: 0,
  applyIfAccountId: '',
  applyIfTransactionType: '',
  conditionsType: '',
  conditions: [
    {
      field: 'description',
      comparator: 'contains',
      value: 'payment',
    },
  ],
  assignCategory: '',
  assignAccountId: '',
};

export interface RuleFormValues {
  name: string;
  order: number;
  applyIfAccountId: string;
  applyIfTransactionType: string;
  conditionsType: string;
  conditions: Array<{
    field: string;
    comparator: string;
    value: string;
  }>;
  assignCategory: string;
  assignAccountId: string;
}

export const TransactionTypeOptions = [
  { value: 'deposit', text: 'Deposit' },
  { value: 'withdrawal', text: 'Withdrawal' },
];
export const Fields = [
  { value: 'description', text: 'Description' },
  { value: 'amount', text: 'Amount' },
  { value: 'payee', text: 'Payee' },
];
export const FieldCondition = [
  { value: 'contains', text: 'Contains' },
  { value: 'equals', text: 'equals' },
  { value: 'not_contains', text: 'Not Contains' },
];
export const AssignTransactionTypeOptions = [
  { value: 'expense', text: 'Expense' },
];
