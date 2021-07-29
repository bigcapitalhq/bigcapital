import { IModelMeta } from 'interfaces';

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
    },
    'amount': {
      name: 'Amount',
      column: 'amount',
      columnable: true,
      fieldType: 'number',
    },
    'due_amount': {
      name: 'Due amount',
      column: 'due_amount',
      columnable: true,
      fieldType: 'number',
    },
    'payment_account': {
      name: 'Payment account',
      column: 'payment_account_id',
    },
    'payment_number': {
      name: 'Payment number',
      column: 'payment_number',
      columnable: true,
      fieldType: 'number',
    },
    'payment_date': {
      name: 'Payment date',
      column: 'payment_date',
      columnable: true,
      fieldType: 'date',
    },
    'reference_no': {
      name: 'Reference No.',
      column: 'reference',
      columnable: true,
      fieldType: 'text',
    },
    'description': {
      name: 'Description',
      column: 'description',
      columnable: true,
      fieldType: 'text',
    },
    'created_at': {
      name: 'Created at',
      column: 'created_at',
      columnable: true,
      fieldType: 'date',
    },
  },
};
