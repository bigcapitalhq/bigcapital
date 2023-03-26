
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