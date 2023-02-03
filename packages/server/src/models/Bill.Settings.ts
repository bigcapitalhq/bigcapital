
export default {
  defaultFilterField: 'vendor',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'bill_date',
  },
  fields: {
    vendor: {
      name: 'bill.field.vendor',
      column: 'vendor_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'vendor',

      relationEntityLabel: 'display_name',
      relationEntityKey: 'id',
    },
    bill_number: {
      name: 'bill.field.bill_number',
      column: 'bill_number',
      columnable: true,
      fieldType: 'text',
    },
    bill_date: {
      name: 'bill.field.bill_date',
      column: 'bill_date',
      columnable: true,
      fieldType: 'date',
    },
    due_date: {
      name: 'bill.field.due_date',
      column: 'due_date',
      columnable: true,
      fieldType: 'date',
    },
    reference_no: {
      name: 'bill.field.reference_no',
      column: 'reference_no',
      columnable: true,
      fieldType: 'text',
    },
    status: {
      name: 'bill.field.status',
      fieldType: 'enumeration',
      columnable: true,
      options: [
        { label: 'bill.field.status.paid', key: 'paid' },
        { label: 'bill.field.status.partially-paid', key: 'partially-paid' },
        { label: 'bill.field.status.overdue', key: 'overdue' },
        { label: 'bill.field.status.unpaid', key: 'unpaid' },
        { label: 'bill.field.status.opened', key: 'opened' },
        { label: 'bill.field.status.draft', key: 'draft' },
      ],
      filterCustomQuery: StatusFieldFilterQuery,
      sortCustomQuery: StatusFieldSortQuery,
    },
    amount: {
      name: 'bill.field.amount',
      column: 'amount',
      fieldType: 'number',
    },
    payment_amount: {
      name: 'bill.field.payment_amount',
      column: 'payment_amount',
      fieldType: 'number',
    },
    note: {
      name: 'bill.field.note',
      column: 'note',
      fieldType: 'text',
    },
    created_at: {
      name: 'bill.field.created_at',
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
