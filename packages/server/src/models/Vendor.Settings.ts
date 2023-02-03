export default {
  defaultFilterField: 'display_name',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'created_at',
  },
  fields: {
    first_name: {
      name: 'vendor.field.first_name',
      column: 'first_name',
      fieldType: 'text',
    },
    last_name: {
      name: 'vendor.field.last_name',
      column: 'last_name',
      fieldType: 'text',
    },
    display_name: {
      name: 'vendor.field.display_name',
      column: 'display_name',
      fieldType: 'text',
    },
    email: {
      name: 'vendor.field.email',
      column: 'email',
      fieldType: 'text',
    },
    work_phone: {
      name: 'vendor.field.work_phone',
      column: 'work_phone',
      fieldType: 'text',
    },
    personal_phone: {
      name: 'vendor.field.personal_pone',
      column: 'personal_phone',
      fieldType: 'text',
    },
    company_name: {
      name: 'vendor.field.company_name',
      column: 'company_name',
      fieldType: 'text',
    },
    website: {
      name: 'vendor.field.website',
      column: 'website',
      fieldType: 'text',
    },
    created_at: {
      name: 'vendor.field.created_at',
      column: 'created_at',
      fieldType: 'date',
    },
    balance: {
      name: 'vendor.field.balance',
      column: 'balance',
      fieldType: 'number',
    },
    opening_balance: {
      name: 'vendor.field.opening_balance',
      column: 'opening_balance',
      fieldType: 'number',
    },
    opening_balance_at: {
      name: 'vendor.field.opening_balance_at',
      column: 'opening_balance_at',
      fieldType: 'date',
    },
    currency_code: {
      name: 'vendor.field.currency',
      column: 'currency_code',
      fieldType: 'text',
    },
    status: {
      name: 'vendor.field.status',
      type: 'enumeration',
      options: [
        { key: 'overdue', label: 'vendor.field.status.overdue' },
        { key: 'unpaid', label: 'vendor.field.status.unpaid' },
      ],
      filterCustomQuery: (query, role) => {
        switch (role.value) {
          case 'overdue':
            query.modify('overdue');
            break;
          case 'unpaid':
            query.modify('unpaid');
            break;
        }
      },
    },
  },
};
