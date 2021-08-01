export default {
  defaultFilterField: 'customer',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'created_at',
  },
  fields: {
    customer: {
      name: 'Customer',
      column: 'customer_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'customer',

      relationEntityLabel: 'display_name',
      relationEntityKey: 'id',
    },
    invoice_date: {
      name: 'Invoice date',
      column: 'invoice_date',
      fieldType: 'date',
    },
    due_date: {
      name: 'Due date',
      column: 'due_date',
      fieldType: 'date',
    },
    invoice_no: {
      name: 'Invoice No.',
      column: 'invoice_no',
      fieldType: 'text',
    },
    reference_no: {
      name: 'Reference No.',
      column: 'reference_no',
      fieldType: 'text',
    },
    invoice_message: {
      name: 'Invoice message',
      column: 'invoice_message',
      fieldType: 'text',
    },
    terms_conditions: {
      name: 'Terms & conditions',
      column: 'terms_conditions',
      fieldType: 'text',
    },
    amount: {
      name: 'Invoice amount',
      column: 'balance',
      fieldType: 'number',
    },
    payment_amount: {
      name: 'Payment amount',
      column: 'payment_amount',
      fieldType: 'number',
    },
    due_amount: { // calculated.
      name: 'Due amount',
      column: 'due_amount',
      fieldType: 'number',
      virtualColumn: true,
    },
    status: {
      name: 'Status',
      columnable: true,
      fieldType: 'enumeration',
      options: [
        { key: 'draft', name: 'Draft' },
        { key: 'delivered', name: 'Delivered' },
        { key: 'unpaid', name: 'Unpaid' },
        { key: 'overdue', name: 'Overdue' },
        { key: 'partially-paid', name: 'Partially paid' },
        { key: 'paid', name: 'Paid' },
      ],
      filterCustomQuery: StatusFieldFilterQuery,
      sortCustomQuery: StatusFieldSortQuery,
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