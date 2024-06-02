function StatusFieldFilterQuery(query, role) {
  query.modify('filterByStatus', role.value);
}

function StatusFieldSortQuery(query, role) {
  query.modify('sortByStatus', role.order);
}

export default {
  defaultFilterField: 'name',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'name',
  },
  exportable: true,
  exportFlattenOn: 'entries',

  importable: true,
  importAggregator: 'group',
  importAggregateOn: 'entries',
  importAggregateBy: 'creditNoteNumber',

  print: {
    pageTitle: 'Credit Notes',
  },

  fields: {
    customer: {
      name: 'credit_note.field.customer',
      column: 'customer_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'customer',

      relationEntityLabel: 'display_name',
      relationEntityKey: 'id',
    },
    credit_date: {
      name: 'credit_note.field.credit_note_date',
      column: 'credit_note_date',
      fieldType: 'date',
    },
    credit_number: {
      name: 'credit_note.field.credit_note_number',
      column: 'credit_note_number',
      fieldType: 'text',
    },
    reference_no: {
      name: 'credit_note.field.reference_no',
      column: 'reference_no',
      fieldType: 'text',
    },
    amount: {
      name: 'credit_note.field.amount',
      column: 'amount',
      fieldType: 'number',
    },
    currency_code: {
      name: 'credit_note.field.currency_code',
      column: 'currency_code',
      fieldType: 'number',
    },
    note: {
      name: 'credit_note.field.note',
      column: 'note',
      fieldType: 'text',
    },
    terms_conditions: {
      name: 'credit_note.field.terms_conditions',
      column: 'terms_conditions',
      fieldType: 'text',
    },
    status: {
      name: 'credit_note.field.status',
      fieldType: 'enumeration',
      options: [
        { key: 'draft', label: 'credit_note.field.status.draft' },
        { key: 'published', label: 'credit_note.field.status.published' },
        { key: 'open', label: 'credit_note.field.status.open' },
        { key: 'closed', label: 'credit_note.field.status.closed' },
      ],
      filterCustomQuery: StatusFieldFilterQuery,
      sortCustomQuery: StatusFieldSortQuery,
    },
    created_at: {
      name: 'credit_note.field.created_at',
      column: 'created_at',
      fieldType: 'date',
    },
  },
  columns: {
    customer: {
      name: 'Customer',
      accessor: 'customer.displayName',
    },
    exchangeRate: {
      name: 'Exchange Rate',
      printable: false,
    },
    creditNoteDate: {
      name: 'Credit Note Date',
      accessor: 'formattedCreditNoteDate'
    },
    referenceNo: {
      name: 'Reference No.',
    },
    note: {
      name: 'Note',
    },
    termsConditions: {
      name: 'Terms & Conditions',
      printable: false,
    },
    creditNoteNumber: {
      name: 'Credit Note Number',
      printable: false,
    },
    open: {
      name: 'Open',
      type: 'boolean',
      printable: false,
    },
    entries: {
      name: 'Entries',
      type: 'collection',
      collectionOf: 'object',
      columns: {
        itemName: {
          name: 'Item Name',
          accessor: 'item.name',
        },
        rate: {
          name: 'Item Rate',
          accessor: 'rateFormatted',
        },
        quantity: {
          name: 'Item Quantity',
          accessor: 'quantityFormatted',
        },
        description: {
          name: 'Item Description',
        },
        amount: {
          name: 'Item Amount',
          accessor: 'totalFormatted',
        },
      },
    },
  },
  fields2: {
    customerId: {
      name: 'Customer',
      fieldType: 'relation',
      relationModel: 'Contact',
      relationImportMatch: 'displayName',
      required: true,
    },
    exchangeRate: {
      name: 'Exchange Rate',
      fieldType: 'number',
    },
    creditNoteDate: {
      name: 'Credit Note Date',
      fieldType: 'date',
      required: true,
    },
    referenceNo: {
      name: 'Reference No.',
      fieldType: 'text',
    },
    note: {
      name: 'Note',
      fieldType: 'text',
    },
    termsConditions: {
      name: 'Terms & Conditions',
      fieldType: 'text',
    },
    creditNoteNumber: {
      name: 'Credit Note Number',
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
      fields: {
        itemId: {
          name: 'Item',
          fieldType: 'relation',
          relationModel: 'Item',
          relationImportMatch: ['name', 'code'],
          required: true,
          importHint: 'Matches the item name or code.',
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
          name: 'Description',
          fieldType: 'text',
        },
      },
    },
  },
};
