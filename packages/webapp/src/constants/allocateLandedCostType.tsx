import intl from 'react-intl-universal';

export const AllocateLandedCostType: Array<{ name: string; value: string }> = [
  { name: intl.get('bills'), value: 'Bill' },
  { name: intl.get('expenses'), value: 'Expense' },
];
