import { ACCOUNT_TYPES } from '@/data/AccountTypes';

export default {
  defaultFilterField: 'name',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'name',
  },
  fields: {
    name: {
      name: 'account.field.name',
      column: 'name',
      fieldType: 'text',
    },
    description: {
      name: 'account.field.description',
      column: 'description',
      fieldType: 'text',
    },
    slug: {
      name: 'account.field.slug',
      column: 'slug',
      fieldType: 'text',
      columnable: false,
      filterable: false,
    },
    code: {
      name: 'account.field.code',
      column: 'code',
      fieldType: 'text',
    },
    root_type: {
      name: 'account.field.root_type',
      fieldType: 'enumeration',
      options: [
        { key: 'asset', label: 'Asset' },
        { key: 'liability', label: 'Liability' },
        { key: 'equity', label: 'Equity' },
        { key: 'Income', label: 'Income' },
        { key: 'expense', label: 'Expense' },
      ],
      filterCustomQuery: RootTypeFieldFilterQuery,
      sortable: false,
    },
    normal: {
      name: 'account.field.normal',
      fieldType: 'enumeration',
      options: [
        { key: 'debit', label: 'account.field.normal.debit' },
        { key: 'credit', label: 'account.field.normal.credit' },
      ],
      filterCustomQuery: NormalTypeFieldFilterQuery,
      sortable: false,
    },
    type: {
      name: 'account.field.type',
      column: 'account_type',
      fieldType: 'enumeration',
      options: ACCOUNT_TYPES.map((accountType) => ({
        label: accountType.label,
        key: accountType.key
      })),
    },
    active: {
      name: 'account.field.active',
      column: 'active',
      fieldType: 'boolean',
      filterable: false,
    },
    balance: {
      name: 'account.field.balance',
      column: 'amount',
      fieldType: 'number',
    },
    currency: {
      name: 'account.field.currency',
      column: 'currency_code',
      fieldType: 'text',
      filterable: false,
    },
    created_at: {
      name: 'account.field.created_at',
      column: 'created_at',
      fieldType: 'date',
    },
  },
};

/**
 * Filter query of root type field .
 */
function RootTypeFieldFilterQuery(query, role) {
  query.modify('filterByRootType', role.value);
}

/**
 * Filter query of normal field .
 */
function NormalTypeFieldFilterQuery(query, role) {
  query.modify('filterByAccountNormal', role.value);
}
