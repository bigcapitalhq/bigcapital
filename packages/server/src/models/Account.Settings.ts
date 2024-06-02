import { ACCOUNT_TYPES } from '@/data/AccountTypes';

export default {
  defaultFilterField: 'name',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'name',
  },
  importable: true,
  exportable: true,
  print: {
    pageTitle: 'Chart of Accounts',
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
        key: accountType.key,
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
  columns: {
    name: {
      name: 'account.field.name',
      type: 'text',
    },
    code: {
      name: 'account.field.code',
      type: 'text',
    },
    rootType: {
      name: 'account.field.root_type',
      type: 'text',
      accessor: 'accountRootType',
    },
    accountType: {
      name: 'account.field.type',
      accessor: 'accountTypeLabel',
      type: 'text',
    },
    accountNormal: {
      name: 'account.field.normal',
      accessor: 'accountNormalFormatted',
    },
    currencyCode: {
      name: 'account.field.currency',
      type: 'text',
    },
    bankBalance: {
      name: 'account.field.bank_balance',
      accessor: 'bankBalanceFormatted',
      type: 'text',
      exportable: true,
    },
    balance: {
      name: 'account.field.balance',
      accessor: 'formattedAmount',
    },
    description: {
      name: 'account.field.description',
      type: 'text',
    },
    active: {
      name: 'account.field.active',
      type: 'boolean',
    },
    createdAt: {
      name: 'account.field.created_at',
      printable: false,
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
