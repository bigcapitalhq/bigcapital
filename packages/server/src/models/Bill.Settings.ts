export default {
  defaultFilterField: 'vendor',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'bill_date',
  },
  importable: true,
  importAggregator: 'group',
  importAggregateOn: 'entries',
  importAggregateBy: 'billNumber',
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
  fields2: {
    billNumber: {
      name: 'Bill No.',
      fieldType: 'text',
      required: true,
    },
    referenceNo: {
      name: 'Reference No.',
      fieldType: 'text',
    },
    billDate: {
      name: 'Date',
      fieldType: 'date',
      required: true,
    },
    dueDate: {
      name: 'Due Date',
      fieldType: 'date',
      required: true,
    },
    vendorId: {
      name: 'Vendor',
      fieldType: 'relation',
      relationModel: 'Contact',
      relationImportMatch: 'displayName',
      required: true,
    },
    exchangeRate: {
      name: 'Exchange Rate',
      fieldType: 'number',
    },
    note: {
      name: 'Note',
      fieldType: 'text',
    },
    open: {
      name: 'Open',
      fieldType: 'boolean',
    },
    entries: {
      name: 'Entries',
      fieldType: 'collection',
      collectionOf: 'object',
      collectionMinLength: 1,
      required: true,
      fields: {
        itemId: {
          name: 'Item',
          fieldType: 'relation',
          relationModel: 'Item',
          relationImportMatch: ['name', 'code'],
          required: true,
          importHint: "Matches the item name or code."
        },
        rate: {
          name: 'Rate',
          fieldType: 'number',
          required: true,
        },
        quantity: {
          name: 'Quantity',
          fieldType: 'number',
          required: true,
        },
        description: {
          name: 'Line Description',
          fieldType: 'text',
        },
      },
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
