function StatusFieldFilterQuery(query, role) {
  query.modify('filterByStatus', role.value);
}

function StatusFieldSortQuery(query, role) {
  query.modify('sortByStatus', role.order);
}

export const RecurringInvoiceMeta = {
  defaultFilterField: 'profile_name',
  defaultSort: {
    sortOrder: 'ASC',
    sortField: 'next_invoice_date',
  },
  exportable: false,
  importable: false,

  fields: {
    profile_name: {
      name: 'recurring_invoice.field.profile_name',
      column: 'profile_name',
      fieldType: 'text',
    },
    customer: {
      name: 'recurring_invoice.field.customer',
      column: 'customer_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'customer',

      relationEntityLabel: 'display_name',
      relationEntityKey: 'id',
    },
    reference_no: {
      name: 'recurring_invoice.field.reference_no',
      column: 'reference_no',
      fieldType: 'text',
    },
    frequency: {
      name: 'recurring_invoice.field.frequency',
      column: 'frequency',
      fieldType: 'enumeration',
      options: [
        { key: 'day', label: 'recurring_invoice.field.frequency.day' },
        { key: 'week', label: 'recurring_invoice.field.frequency.week' },
        { key: 'month', label: 'recurring_invoice.field.frequency.month' },
        { key: 'year', label: 'recurring_invoice.field.frequency.year' },
      ],
    },
    repeat_interval: {
      name: 'recurring_invoice.field.repeat_interval',
      column: 'repeat_interval',
      fieldType: 'number',
    },
    start_date: {
      name: 'recurring_invoice.field.start_date',
      column: 'start_date',
      fieldType: 'date',
    },
    next_invoice_date: {
      name: 'recurring_invoice.field.next_invoice_date',
      column: 'next_invoice_date',
      fieldType: 'date',
    },
    last_invoice_date: {
      name: 'recurring_invoice.field.last_invoice_date',
      column: 'last_invoice_date',
      fieldType: 'date',
    },
    status: {
      name: 'recurring_invoice.field.status',
      fieldType: 'enumeration',
      options: [
        { key: 'active', label: 'recurring_invoice.field.status.active' },
        { key: 'paused', label: 'recurring_invoice.field.status.paused' },
        {
          key: 'completed',
          label: 'recurring_invoice.field.status.completed',
        },
      ],
      filterCustomQuery: StatusFieldFilterQuery,
      sortCustomQuery: StatusFieldSortQuery,
    },
    created_at: {
      name: 'recurring_invoice.field.created_at',
      column: 'created_at',
      fieldType: 'date',
    },
  },
};
