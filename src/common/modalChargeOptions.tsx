import intl from 'react-intl-universal';

export const taskChargeOptions = [
  { name: intl.get('task.dialog.hourly_rate'), value: 'Hourly rate' },
  { name: intl.get('task.dialog.fixed_price'), value: 'Fixed price' },
  { name: intl.get('task.dialog.non_chargeable'), value: 'Non-chargeable' },
];

export const expenseChargeOption = [
  {
    name: intl.get('expenses.dialog.markup'),
    value: '% markup',
  },
  { name: intl.get('expenses.dialog.pass_cost_on'), value: 'Pass cost on' },
  { name: intl.get('expemses.dialog.custom_price'), value: 'Custom Pirce' },
  { name: intl.get('expenses.dialog.non_chargeable'), value: 'Non-chargeable' },
];
