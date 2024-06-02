export default {
  defaultFilterField: 'estimate_date',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'estimate_date',
  },
  exportable: true,
  exportFlattenOn: 'entries',

  importable: true,
  importAggregator: 'group',
  importAggregateOn: 'entries',
  importAggregateBy: 'estimateNumber',

  print: {
    pageTitle: 'Sale Estimates'
  },

  fields: {
    amount: {
      name: 'estimate.field.amount',
      column: 'amount',
      fieldType: 'number',
    },
    estimate_number: {
      name: 'estimate.field.estimate_number',
      column: 'estimate_number',
      fieldType: 'text',
    },
    customer: {
      name: 'estimate.field.customer',
      column: 'customer_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'customer',

      relationEntityLabel: 'display_name',
      relationEntityKey: 'id',
    },
    estimate_date: {
      name: 'estimate.field.estimate_date',
      column: 'estimate_date',
      fieldType: 'date',
    },
    expiration_date: {
      name: 'estimate.field.expiration_date',
      column: 'expiration_date',
      fieldType: 'date',
    },
    reference_no: {
      name: 'estimate.field.reference_no',
      column: 'reference',
      fieldType: 'text',
    },
    note: {
      name: 'estimate.field.note',
      column: 'note',
      fieldType: 'text',
    },
    terms_conditions: {
      name: 'estimate.field.terms_conditions',
      column: 'terms_conditions',
      fieldType: 'text',
    },
    status: {
      name: 'estimate.field.status',
      fieldType: 'enumeration',
      options: [
        { label: 'estimate.field.status.delivered', key: 'delivered' },
        { label: 'estimate.field.status.rejected', key: 'rejected' },
        { label: 'estimate.field.status.approved', key: 'approved' },
        { label: 'estimate.field.status.draft', key: 'draft' },
      ],
      filterCustomQuery: StatusFieldFilterQuery,
      sortCustomQuery: StatusFieldSortQuery,
    },
    created_at: {
      name: 'estimate.field.created_at',
      column: 'created_at',
      columnType: 'date',
    },
  },
  columns: {
    customer: {
      name: 'Customer',
      type: 'text',
      accessor: 'customer.displayName',
      exportable: true,
    },
    estimateDate: {
      name: 'Estimate Date',
      type: 'date',
      accessor: 'formattedEstimateDate',
      exportable: true,
    },
    expirationDate: {
      name: 'Expiration Date',
      type: 'date',
      accessor: 'formattedExpirationDate',
      exportable: true,
    },
    estimateNumber: {
      name: 'Estimate No.',
      type: 'text',
      exportable: true,
    },
    reference: {
      name: 'Reference No.',
      type: 'text',
      exportable: true,
    },
    amount: {
      name: 'Amount',
      accessor: 'formattedAmount',
      type: 'text',
    },
    exchangeRate: {
      name: 'Exchange Rate',
      type: 'number',
      exportable: true,
      printable: false,
    },
    currencyCode: {
      name: 'Currency',
      type: 'text',
      exportable: true,
      printable: false,
    },
    note: {
      name: 'Note',
      type: 'text',
      exportable: true,
      printable: false,
    },
    termsConditions: {
      name: 'Terms & Conditions',
      type: 'text',
      exportable: true,
      printable: false,
    },
    delivered: {
      name: 'Delivered',
      type: 'boolean',
      exportable: true,
      printable: false,
    },
    entries: {
      name: 'Entries',
      accessor: 'entries',
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
          printable: false,
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
      relationImportMatch: ['displayName'],
      required: true,
    },
    estimateDate: {
      name: 'Estimate Date',
      fieldType: 'date',
      required: true,
    },
    expirationDate: {
      name: 'Expiration Date',
      fieldType: 'date',
      required: true,
    },
    estimateNumber: {
      name: 'Estimate No.',
      fieldType: 'text',
    },
    reference: {
      name: 'Reference No.',
      fieldType: 'text',
    },
    exchangeRate: {
      name: 'Exchange Rate',
      fieldType: 'number',
    },
    currencyCode: {
      name: 'Currency',
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
    delivered: {
      name: 'Delivered',
      type: 'boolean',
    },
    entries: {
      name: 'Entries',
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
          importHint: 'Matches the item name or code.',
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
          name: 'Line Description',
          fieldType: 'text',
        },
      },
    },
  },
};

function StatusFieldSortQuery(query, role) {
  query.modify('orderByStatus', role.order);
}

function StatusFieldFilterQuery(query, role) {
  query.modify('filterByStatus', role.value);
}
