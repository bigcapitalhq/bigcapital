export default {
  fields: {
    first_name: {
      name: 'customer.field.first_name',
      column: 'first_name',
      fieldType: 'text',
    },
    last_name: {
      name: 'customer.field.last_name',
      column: 'last_name',
      fieldType: 'text',
    },
    display_name: {
      name: 'customer.field.display_name',
      column: 'display_name',
      fieldType: 'text',
    },
    email: {
      name: 'customer.field.email',
      column: 'email',
      fieldType: 'text',
    },
    work_phone: {
      name: 'customer.field.work_phone',
      column: 'work_phone',
      fieldType: 'text',
    },
    personal_phone: {
      name: 'customer.field.personal_phone',
      column: 'personal_phone',
      fieldType: 'text',
    },
    company_name: {
      name: 'customer.field.company_name',
      column: 'company_name',
      fieldType: 'text',
    },
    website: {
      name: 'customer.field.website',
      column: 'website',
      fieldType: 'text',
    },
    created_at: {
      name: 'customer.field.created_at',
      column: 'created_at',
      fieldType: 'date',
    },
    balance: {
      name: 'customer.field.balance',
      column: 'balance',
      fieldType: 'number',
    },
    opening_balance: {
      name: 'customer.field.opening_balance',
      column: 'opening_balance',
      fieldType: 'number',
    },
    opening_balance_at: {
      name: 'customer.field.opening_balance_at',
      column: 'opening_balance_at',
      filterable: false,
      fieldType: 'date',
    },
    currency_code: {
      name: 'customer.field.currency',
      column: 'currency_code',
      fieldType: 'text',
    },
    status: {
      name: 'customer.field.status',
      fieldType: 'enumeration',
      options: [
        { key: 'active', label: 'customer.field.status.active' },
        { key: 'inactive', label: 'customer.field.status.inactive' },
        { key: 'overdue', label: 'customer.field.status.overdue' },
        { key: 'unpaid', label: 'customer.field.status.unpaid' },
      ],
      filterCustomQuery: statusFieldFilterQuery,
    },
  },
};

function statusFieldFilterQuery(query, role) {
  switch (role.value) {
    case 'overdue':
      query.modify('overdue');
      break;
    case 'unpaid':
      query.modify('unpaid');
      break;
  }
}
