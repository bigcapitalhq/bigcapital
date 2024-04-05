import { ACCOUNT_TYPES } from '@/data/AccountTypes';

export default {
  defaultFilterField: 'name',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'name',
  },
  importable: true,
  fields: {
    name: {
      name: 'account.field.name',
      column: 'name',
      fieldType: 'text',
      unique: true,
      required: true,
      importable: true,
      exportable: true,
      order: 1,
    },
    description: {
      name: 'account.field.description',
      column: 'description',
      fieldType: 'text',
      importable: true,
      exportable: true,
    },
    slug: {
      name: 'account.field.slug',
      column: 'slug',
      fieldType: 'text',
      columnable: false,
      filterable: false,
      importable: false,
    },
    code: {
      name: 'account.field.code',
      column: 'code',
      fieldType: 'text',
      exportable: true,
      importable: true,
      minLength: 3,
      maxLength: 6,
      unique: true,
      importHint: 'Unique number to identify the account.',
    },
    rootType: {
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
      importable: false,
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
      importable: false,
    },
    accountType: {
      name: 'account.field.type',
      column: 'account_type',
      fieldType: 'enumeration',
      options: ACCOUNT_TYPES.map((accountType) => ({
        label: accountType.label,
        key: accountType.key,
      })),
      required: true,
      importable: true,
      exportable: true,
      order: 2,
    },
    active: {
      name: 'account.field.active',
      column: 'active',
      fieldType: 'boolean',
      filterable: false,
      exportable: true,
      importable: true,
    },
    balance: {
      name: 'account.field.balance',
      column: 'amount',
      fieldType: 'number',
      importable: false,
    },
    currencyCode: {
      name: 'account.field.currency',
      column: 'currency_code',
      fieldType: 'text',
      filterable: false,
      importable: true,
      exportable: true,
    },
    parentAccount: {
      name: 'account.field.parent_account',
      column: 'parent_account_id',
      fieldType: 'relation',
      to: { model: 'Account', to: 'id' },
      importable: false,
    },
    createdAt: {
      name: 'account.field.created_at',
      column: 'created_at',
      fieldType: 'date',
      importable: false,
      exportable: true,
    },
  },
  fields2: {
    name: {
      name: 'account.field.name',
      fieldType: 'text',
      unique: true,
      required: true,
    },
    description: {
      name: 'account.field.description',
      fieldType: 'text',
    },
    code: {
      name: 'account.field.code',
      fieldType: 'text',
      minLength: 3,
      maxLength: 6,
      unique: true,
      importHint: 'Unique number to identify the account.',
    },
    accountType: {
      name: 'account.field.type',
      fieldType: 'enumeration',
      options: ACCOUNT_TYPES.map((accountType) => ({
        label: accountType.label,
        key: accountType.key,
      })),
      required: true,
    },
    active: {
      name: 'account.field.active',
      fieldType: 'boolean',
    },
    currencyCode: {
      name: 'account.field.currency',
      fieldType: 'text',
    },
    parentAccountId: {
      name: 'account.field.parent_account',
      fieldType: 'relation',
      relationModel: 'Account',
      relationImportMatch: ['name', 'code'],
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
