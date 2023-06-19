// @ts-nocheck
import intl from 'react-intl-universal';

export const taskChargeOptions = [
  { name: intl.get('project_task.dialog.hourly_rate'), value: 'TIME' },
  { name: intl.get('project_task.dialog.fixed_price'), value: 'FIXED' },
  {
    name: intl.get('project_task.dialog.non_chargeable'),
    value: 'NON_CHARGABLE',
  },
];

export const expenseChargeOption = [
  {
    name: intl.get('expenses.dialog.markup'),
    value: 'markup',
  },
  { name: intl.get('expenses.dialog.pass_cost_on'), value: 'pass_cost_on' },
  { name: intl.get('expenses.dialog.custom_price'), value: 'custom_price' },
  { name: intl.get('expenses.dialog.non_chargeable'), value: 'non_chargeable' },
];

export const billableTypeOption = [
  {
    id: 1,
    name: intl.get('project_billable_entries.dialog.task'),
    value: 'Task',
  },
  {
    id: 2,
    name: intl.get('project_billable_entries.dialog.bill'),
    value: 'Bill',
  },
  {
    id: 3,
    name: intl.get('project_billable_entries.dialog.expense'),
    value: 'Expense',
  },
];
