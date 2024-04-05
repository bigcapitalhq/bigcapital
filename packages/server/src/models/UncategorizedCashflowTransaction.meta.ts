export default {
  defaultFilterField: 'createdAt',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'createdAt',
  },
  importable: true,
  fields: {
    date: {
      name: 'Date',
      column: 'date',
      fieldType: 'date',
      importable: true,
      required: true,
    },
    payee: {
      name: 'Payee',
      column: 'payee',
      fieldType: 'text',
      importable: true,
    },
    description: {
      name: 'Description',
      column: 'description',
      fieldType: 'text',
      importable: true,
    },
    referenceNo: {
      name: 'Reference No.',
      column: 'reference_no',
      fieldType: 'text',
      importable: true,
    },
    amount: {
      name: 'Amount',
      column: 'Amount',
      fieldType: 'numeric',
      required: true,
      importable: true,
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
   
  }
};
