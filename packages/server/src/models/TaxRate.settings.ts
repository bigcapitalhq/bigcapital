export default {
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'created_at',
  },
  exportable: true,
  importable: true,
  print: {
    pageTitle: 'Tax Rates',
  },
  columns: {
    name: {
      name: 'Tax Rate Name',
      type: 'text',
      accessor: 'name',
    },
    code: {
      name: 'Code',
      type: 'text',
      accessor: 'code',
    },
    rate: {
      name: 'Rate',
      type: 'text',
    },
    description: {
      name: 'Description',
      type: 'text',
    },
    isNonRecoverable: {
      name: 'Is Non Recoverable',
      type: 'boolean',
    },
    active: {
      name: 'Active',
      type: 'boolean',
    },
  },
  field: {},
  fields2: {
    name: {
      name: 'Tax name',
      fieldType: 'name',
      required: true,
    },
    code: {
      name: 'Code',
      fieldType: 'code',
      required: true,
    },
    rate: {
      name: 'Rate',
      fieldType: 'number',
      required: true,
    },
    description: {
      name: 'Description',
      fieldType: 'text',
    },
    isNonRecoverable: {
      name: 'Is Non Recoverable',
      fieldType: 'boolean',
    },
    active: {
      name: 'Active',
      fieldType: 'boolean',
    },
  },
};
