export default {
  defaultFilterField: 'customer',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'created_at',
  },
  fields: {
    customer: {
      name: 'invoice.field.customer',
      column: 'customer_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'customer',

      relationEntityLabel: 'display_name',
      relationEntityKey: 'id',
    },
    invoice_date: {
      name: 'invoice.field.invoice_date',
      column: 'invoice_date',
      fieldType: 'date',
    },
    due_date: {
      name: 'invoice.field.due_date',
      column: 'due_date',
      fieldType: 'date',
    },
    invoice_no: {
      name: 'invoice.field.invoice_no',
      column: 'invoice_no',
      fieldType: 'text',
    },
    reference_no: {
      name: 'invoice.field.reference_no',
      column: 'reference_no',
      fieldType: 'text',
    },
    invoice_message: {
      name: 'invoice.field.invoice_message',
      column: 'invoice_message',
      fieldType: 'text',
    },
    terms_conditions: {
      name: 'invoice.field.terms_conditions',
      column: 'terms_conditions',
      fieldType: 'text',
    },
    amount: {
      name: 'invoice.field.amount',
      column: 'balance',
      fieldType: 'number',
    },
    payment_amount: {
      name: 'invoice.field.payment_amount',
      column: 'payment_amount',
      fieldType: 'number',
    },
    due_amount: {
      // calculated.
      name: 'invoice.field.due_amount',
      column: 'due_amount',
      fieldType: 'number',
      virtualColumn: true,
    },
    status: {
      name: 'invoice.field.status',
      fieldType: 'enumeration',
      options: [
        { key: 'draft', label: 'invoice.field.status.draft' },
        { key: 'delivered', label: 'invoice.field.status.delivered' },
        { key: 'unpaid', label: 'invoice.field.status.unpaid' },
        { key: 'overdue', label: 'invoice.field.status.overdue' },
        { key: 'partially-paid', label: 'invoice.field.status.partially-paid' },
        { key: 'paid', label: 'invoice.field.status.paid' },
      ],
      filterCustomQuery: StatusFieldFilterQuery,
      sortCustomQuery: StatusFieldSortQuery,
    },
    created_at: {
      name: 'invoice.field.created_at',
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
