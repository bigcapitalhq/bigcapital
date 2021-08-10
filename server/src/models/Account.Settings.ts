import { IModelMeta } from 'interfaces';
import { ACCOUNT_TYPES } from 'data/AccountTypes';

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
      fieldType: 'text',
    },
    description: {
      name: 'Description',
      column: 'description',
      fieldType: 'text',
    },
    slug: {
      name: 'Account slug',
      column: 'slug',
      fieldType: 'text',
      columnable: false,
      filterable: false,
    },
    code: {
      name: 'Account code',
      column: 'code',
      fieldType: 'text',
    },
    root_type: {
      name: 'Root type',
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
      name: 'Account normal',
      fieldType: 'enumeration',
      options: [
        { key: 'debit', label: 'Debit' },
        { key: 'credit', label: 'Credit' },
      ],
      filterCustomQuery: NormalTypeFieldFilterQuery,
      sortable: false,
    },
    type: {
      name: 'Type',
      column: 'account_type',
      fieldType: 'enumeration',
      options: ACCOUNT_TYPES.map((accountType) => ({
        label: accountType.label,
        key: accountType.key
      })),
    },
    active: {
      name: 'Active',
      column: 'active',
      fieldType: 'boolean',
      filterable: false,
    },
    balance: {
      name: 'Account balance',
      column: 'amount',
      fieldType: 'number',
    },
    currency: {
      name: 'Currency',
      column: 'currency_code',
      fieldType: 'text',
      filterable: false,
    },
    created_at: {
      name: 'Created at',
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
