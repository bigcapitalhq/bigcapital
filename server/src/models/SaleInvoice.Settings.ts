export default {
  defaultFilterField: 'customer',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'created_at',
  },
  fields: {
    // customer: {
    //   name: 'Customer',
    //   column: 'customer_id',
    // },
    invoice_date: {
      name: 'Invoice date',
      column: 'invoice_date',
      fieldType: 'date',
      columnable: true,
    },
    due_date: {
      name: 'Due date',
      column: 'due_date',
      fieldType: 'date',
      columnable: true,
    },
    invoice_no: {
      name: 'Invoice No.',
      column: 'invoice_no',
      fieldType: 'text',
      columnable: true,
    },
    reference_no: {
      name: 'Reference No.',
      column: 'reference_no',
      fieldType: 'text',
      columnable: true,
    },
    invoice_message: {
      name: 'Invoice message',
      column: 'invoice_message',
      fieldType: 'text',
      columnable: true,
    },
    terms_conditions: {
      name: 'Terms & conditions',
      column: 'terms_conditions',
      fieldType: 'text',
      columnable: true,
    },
    amount: {
      name: 'Invoice amount',
      column: 'balance',
      columnable: true,
      fieldType: 'number',
    },
    payment_amount: {
      name: 'Payment amount',
      column: 'payment_amount',
      fieldType: 'number',
    },
    due_amount: {
      name: 'Due amount',
      column: 'due_amount',
      fieldType: 'number',
      // sortQuery: SaleInvoice.dueAmountFieldSortQuery,
    },
    created_at: {
      name: 'Created at',
      column: 'created_at',
      fieldType: 'date',
    },
    // status: {
    //   name: 'Status',
    //   columnable: true,
    //   fieldType: 'enumeration',
    //   options: [
    //     { key: 'draft', name: 'Draft' },
    //     { key: 'delivered', name: 'Delivered' },
    //     { key: 'unpaid', name: 'Unpaid' },
    //     { key: 'overdue', name: 'Overdue' },
    //     { key: 'partially-paid', name: 'Partially paid' },
    //     { key: 'paid', name: 'Paid' },
    //   ],
    //   // filterQuery: SaleInvoice.statusFieldFilterQuery,
    //   // sortQuery: SaleInvoice.statusFieldSortQuery,
    // },
  },
};
