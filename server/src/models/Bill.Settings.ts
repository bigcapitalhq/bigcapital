import { IModelMeta } from 'interfaces';
import Bill from './Bill';

export default {
  defaultFilterField: 'vendor',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'bill_date',
  },
  fields: {
    // vendor: {
    //   name: 'Vendor',
    //   column: 'vendor_id',
    // },
    'bill_number': {
      name: 'Bill number',
      column: 'bill_number',
      columnable: true,
      fieldType: 'text',
    },
    'bill_date': {
      name: 'Bill date',
      column: 'bill_date',
      columnable: true,
      fieldType: 'date',
    },
    'due_date': {
      name: 'Due date',
      column: 'due_date',
      columnable: true,
      fieldType: 'date',
    },
    'reference_no': {
      name: 'Reference No.',
      column: 'reference_no',
      columnable: true,
      fieldType: 'text',
    },
    'status': {
      name: 'Status',
      fieldType: 'enumeration',
      columnable: true,
      options: [
        { name: 'Paid', key: 'paid' },
        { name: 'Partially paid', key: 'partially-paid' },
        { name: 'Overdue', key: 'overdue' },
        { name: 'Unpaid', key: 'unpaid' },
        { name: 'Opened', key: 'opened' },
        { name: 'Draft', key: 'draft' },
      ],
      // filterQuery: Bill.statusFieldFilterQuery,
      // sortQuery: Bill.statusFieldSortQuery,
    },
    'amount': {
      name: 'Amount',
      column: 'amount',
      columnable: true,
      fieldType: 'number',
    },
    'payment_amount': {
      name: 'Payment amount',
      column: 'payment_amount',
      columnable: true,
      fieldType: 'number',
    },
    'note': {
      name: 'Note',
      column: 'note',
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
} as IModelMeta;
