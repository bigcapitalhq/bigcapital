export default {
  defaultFilterField: 'createdAt',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'created_at',
  },
  importable: true,
  fields: {
    date: {
      name: 'Date',
      column: 'date',
      fieldType: 'date',
    },
    payee: {
      name: 'Payee',
      column: 'payee',
      fieldType: 'text',
    },
    description: {
      name: 'Description',
      column: 'description',
      fieldType: 'text',
    },
    referenceNo: {
      name: 'Reference No.',
      column: 'reference_no',
      fieldType: 'text',
    },
    amount: {
      name: 'Amount',
      column: 'Amount',
      fieldType: 'numeric',
      required: true,
    },
    account: {
      name: 'Account',
      column: 'account_id',
      fieldType: 'relation',
      to: { model: 'Account', to: 'id' },
    },
    createdAt: {
      name: 'Created At',
      column: 'createdAt',
      fieldType: 'date',
      importable: false,
    },
  },
  fields2: {
    date: {
      name: 'Date',
      fieldType: 'date',
      required: true,
    },
    payee: {
      name: 'Payee',
      fieldType: 'text',
    },
    description: {
      name: 'Description',
      fieldType: 'text',
    },
    referenceNo: {
      name: 'Reference No.',
      fieldType: 'text',
    },
    amount: {
      name: 'Amount',
      fieldType: 'number',
      required: true,
    },
  },
};
