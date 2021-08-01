
export default {
  defaultFilterField: 'vendor',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'bill_date',
  },
  fields: {
    'vendor': {
      name: 'Vendor name',
      column: 'vendor_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'vendor',

      relationEntityLabel: 'display_name',
      relationEntityKey: 'id',
    },
    'amount': {
      name: 'Amount',
      column: 'amount',
      fieldType: 'number',
    },
    'due_amount': {
      name: 'Due amount',
      column: 'due_amount',
      fieldType: 'number',
    },
    'payment_account': {
      name: 'Payment account',
      column: 'payment_account_id',

      fieldType: 'relation',
      fieldRelation: 'paymentAccount',

      fieldRelationType: 'enumeration',
      relationLabelField: 'name',
      relationKeyField: 'slug',
    },
    'payment_number': {
      name: 'Payment number',
      column: 'payment_number',
      fieldType: 'number',
    },
    'payment_date': {
      name: 'Payment date',
      column: 'payment_date',
      fieldType: 'date',
    },
    'reference_no': {
      name: 'Reference No.',
      column: 'reference',
      fieldType: 'text',
    },
    'description': {
      name: 'Description',
      column: 'description',
      fieldType: 'text',
    },
    'created_at': {
      name: 'Created at',
      column: 'created_at',
      fieldType: 'date',
    },
  },
};
