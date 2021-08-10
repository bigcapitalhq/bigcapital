import { IModelMeta } from 'interfaces';
import Bill from './Bill';

export default {
  defaultFilterField: 'vendor',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'bill_date',
  },
  fields: {
    vendor: {
      name: 'Vendor',
      column: 'vendor_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'vendor',

      relationEntityLabel: 'name',
      relationEntityKey: 'id',
    },
    bill_number: {
      name: 'Bill number',
      column: 'bill_number',
      columnable: true,
      fieldType: 'text',
    },
    bill_date: {
      name: 'Bill date',
      column: 'bill_date',
      columnable: true,
      fieldType: 'date',
    },
    due_date: {
      name: 'Due date',
      column: 'due_date',
      columnable: true,
      fieldType: 'date',
    },
    reference_no: {
      name: 'Reference No.',
      column: 'reference_no',
      columnable: true,
      fieldType: 'text',
    },
    status: {
      name: 'Status',
      fieldType: 'enumeration',
      columnable: true,
      options: [
        { label: 'Paid', key: 'paid' },
        { label: 'Partially paid', key: 'partially-paid' },
        { label: 'Overdue', key: 'overdue' },
        { label: 'Unpaid', key: 'unpaid' },
        { label: 'Opened', key: 'opened' },
        { label: 'Draft', key: 'draft' },
      ],
      filterCustomQuery: StatusFieldFilterQuery,
      sortCustomQuery: StatusFieldSortQuery,
    },
    amount: {
      name: 'Amount',
      column: 'amount',
      fieldType: 'number',
    },
    payment_amount: {
      name: 'Payment amount',
      column: 'payment_amount',
      fieldType: 'number',
    },
    note: {
      name: 'Note',
      column: 'note',
      fieldType: 'text',
    },
    created_at: {
      name: 'Created at',
      column: 'created_at',
      fieldType: 'date',
    },
  },
};

/**
 * Status field filter custom query.
 */
function StatusFieldFilterQuery(query, role) {
  query.modify('statusFilter', role.value);
}

/**
 * Status field sort custom query.
 */
function StatusFieldSortQuery(query, role) {
  query.modify('sortByStatus', role.order);
}
