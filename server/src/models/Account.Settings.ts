import { IModelMeta } from 'interfaces';

export default {
  defaultFilterField: 'name',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'name',
  },
  fields: {
    name: {
      name: 'Account name',
      column: 'name',
      columnable: true,
      fieldType: 'text',
    },
    description: {
      name: 'Description',
      column: 'description',
      columnable: true,
      fieldType: 'text',
    },
    code: {
      name: 'Account code',
      column: 'code',
      columnable: true,
      fieldType: 'text',
    },
    root_type: {
      name: 'Root type',
      column: 'root_type',
      columnable: true,
      fieldType: 'enumeration',
      options: [
        { key: 'asset', label: 'Asset' },
        { key: 'liability', label: 'Liability' },
        { key: 'equity', label: 'Equity' },
        { key: 'Income', label: 'Income' },
        { key: 'expense', label: 'Expense' },
      ],
    },
    active: {
      name: 'Active',
      column: 'active',
      fieldType: 'boolean',
    },
    amount: {
      name: 'Account balance',
      column: 'amount',
      columnable: true,
      fieldType: 'number',
    },
    currency: {
      name: 'Currency',
      column: 'currency_code',
      fieldType: 'text',
    },
    created_at: {
      name: 'Created at',
      column: 'created_at',
      fieldType: 'date',
    },
  },
} as IModelMeta;
