export default {
  fields: {
    display_name: {
      name: 'Display name',
      column: 'display_name',
      fieldType: 'text',
      columnable: true,
    },
    email: {
      name: 'Email',
      column: 'email',
      fieldType: 'text',
      columnable: true,
    },
    work_phone: {
      name: 'Work phone',
      column: 'work_phone',
      fieldType: 'text',
      columnable: true,
    },
    personal_phone: {
      name: 'Personal phone',
      column: 'personal_phone',
      fieldType: 'text',
      columnable: true,
    },
    company_name: {
      name: 'Company name',
      column: 'company_name',
      fieldType: 'text',
      columnable: true,
    },
    website: {
      name: 'Website',
      column: 'website',
      fieldType: 'text',
      columnable: true,
    },
    created_at: {
      name: 'Created at',
      column: 'created_at',
      fieldType: 'date',
      columnable: true,
    },
    balance: {
      name: 'Balance',
      column: 'balance',
      fieldType: 'number',
      columnable: true,
    },
    opening_balance: {
      name: 'Opening balance',
      column: 'opening_balance',
      fieldType: 'number',
      columnable: true,
    },
    opening_balance_at: {
      name: 'Opening balance at',
      column: 'opening_balance_at',
      filterable: false,
      fieldType: 'date',
      columnable: true,
    },
    currency_code: {
      column: 'currency_code',
      columnable: true,
      fieldType: 'text',
    },
    status: {
      label: 'Status',
      options: [
        { key: 'active', label: 'Active' },
        { key: 'inactive', label: 'Inactive' },
        { key: 'overdue', label: 'Overdue' },
        { key: 'unpaid', label: 'Unpaid' },
      ],
      columnable: true,
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
