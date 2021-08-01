export default {
  defaultFilterField: 'display_name',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'created_at',
  },
  fields: {
    'display_name': {
      name: 'Display name',
      column: 'display_name',
      fieldType: 'text',
    },
    'email': {
      name: 'Email',
      column: 'email',
      fieldType: 'text',
    },
    'work_phone': {
      name: 'Work phone',
      column: 'work_phone',
      fieldType: 'text',
    },
    'personal_phone': {
      name: 'Personal phone',
      column: 'personal_phone',
      fieldType: 'text',
    },
    'company_name': {
      name: 'Company name',
      column: 'company_name',
      fieldType: 'text',
    },
    'website': {
      name: 'Website',
      column: 'website',
      fieldType: 'text',
    },
    'created_at': {
      name: 'Created at',
      column: 'created_at',
      fieldType: 'date',
    },
    'balance': {
      name: 'Balance',
      column: 'balance',
      fieldType: 'number',
    },
    'opening_balance': {
      name: 'Opening balance',
      column: 'opening_balance',
      fieldType: 'number',
    },
    'opening_balance_at': {
      name: 'Opening balance at',
      column: 'opening_balance_at',
      fieldType: 'date',
    },
    'currency_code': {
      name: 'Currency code',
      column: 'currency_code',
      fieldType: 'text',
    },
    'status': {
      label: 'Status',
      options: [
        { key: 'active', label: 'Active' },
        { key: 'inactive', label: 'Inactive' },
        { key: 'overdue', label: 'Overdue' },
        { key: 'unpaid', label: 'Unpaid' },
      ],
      query: (query, role) => {
        switch (role.value) {
          case 'active':
            query.modify('active');
            break;
          case 'inactive':
            query.modify('inactive');
            break;
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
