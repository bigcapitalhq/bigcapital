export default {
  defaultFilterField: 'customer',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'created_at',
  },
  importable: true,
  importAggregator: 'group',
  importAggregateOn: 'entries',
  importAggregateBy: 'invoiceNo',
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
  fields2: {
    invoiceDate: {
      name: 'invoice.field.invoice_date',
      fieldType: 'date',
      required: true,
    },
    dueDate: {
      name: 'invoice.field.due_date',
      fieldType: 'date',
      required: true,
    },
    referenceNo: {
      name: 'invoice.field.reference_no',
      fieldType: 'text',
    },
    invoiceNo: {
      name: 'invoice.field.invoice_no',
      fieldType: 'text',
    },
    customerId: {
      name: 'invoice.field.customer',
      fieldType: 'relation',
      relationModel: 'Contact',
      relationImportMatch: 'displayName',
      required: true,
    },
    exchangeRate: {
      name: 'invoice.field.exchange_rate',
      fieldType: 'number',
    },
    currencyCode: {
      name: 'invoice.field.currency',
      fieldType: 'text',
    },
    invoiceMessage: {
      name: 'invoice.field.invoice_message',
      fieldType: 'text',
    },
    termsConditions: {
      name: 'invoice.field.terms_conditions',
      fieldType: 'text',
    },
    entries: {
      name: 'invoice.field.entries',
      fieldType: 'collection',
      collectionOf: 'object',
      collectionMinLength: 1,
      required: true,
      fields: {
        itemId: {
          name: 'invoice.field.item_name',
          fieldType: 'relation',
          relationModel: 'Item',
          relationImportMatch: ['name', 'code'],
          required: true,
        },
        rate: {
          name: 'invoice.field.rate',
          fieldType: 'number',
          required: true,
        },
        quantity: {
          name: 'invoice.field.quantity',
          fieldType: 'number',
          required: true,
        },
        description: {
          name: 'invoice.field.description',
          fieldType: 'text',
        },
      },
    },
    delivered: {
      name: 'invoice.field.delivered',
      fieldType: 'boolean',
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
