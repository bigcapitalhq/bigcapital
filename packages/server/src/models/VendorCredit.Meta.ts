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
  importable: true,
  importAggregator: 'group',
  importAggregateOn: 'entries',
  importAggregateBy: 'vendorCreditNumber',
  fields: {
    vendor: {
      name: 'vendor_credit.field.vendor',
      column: 'vendor_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'vendor',

      relationEntityLabel: 'display_name',
      relationEntityKey: 'id',
    },
    amount: {
      name: 'vendor_credit.field.amount',
      column: 'amount',
      fieldType: 'number',
    },
    currency_code: {
      name: 'vendor_credit.field.currency_code',
      column: 'currency_code',
      fieldType: 'string',
    },
    credit_date: {
      name: 'vendor_credit.field.credit_date',
      column: 'vendor_credit_date',
      fieldType: 'date',
    },
    reference_no: {
      name: 'vendor_credit.field.reference_no',
      column: 'reference_no',
      fieldType: 'text',
    },
    credit_number: {
      name: 'vendor_credit.field.credit_number',
      column: 'vendor_credit_number',
      fieldType: 'text',
    },
    note: {
      name: 'vendor_credit.field.note',
      column: 'note',
      fieldType: 'text',
    },
    status: {
      name: 'vendor_credit.field.status',
      fieldType: 'enumeration',
      options: [
        { key: 'draft', label: 'vendor_credit.field.status.draft' },
        { key: 'published', label: 'vendor_credit.field.status.published' },
        { key: 'open', label: 'vendor_credit.field.status.open' },
        { key: 'closed', label: 'vendor_credit.field.status.closed' },
      ],
      filterCustomQuery: StatusFieldFilterQuery,
      sortCustomQuery: StatusFieldSortQuery,
    },
    created_at: {
      name: 'vendor_credit.field.created_at',
      column: 'created_at',
      fieldType: 'date',
    },
  },
  fields2: {
    vendorId: {
      name: 'Vendor',
      fieldType: 'relation',
      relationModel: 'Contact',
      relationImportMatch: 'displayName',
      required: true,
    },
    exchangeRate: {
      name: 'Echange Rate',
      fieldType: 'text',
    },
    vendorCreditNumber: {
      name: 'Vendor Credit No.',
      fieldType: 'text',
    },
    referenceNo: {
      name: 'Refernece No.',
      fieldType: 'text',
    },
    vendorCreditDate: {
      name: 'Vendor Credit Date',
      fieldType: 'date',
      required: true,
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
          name: 'Item Name',
          fieldType: 'relation',
          relationModel: 'Item',
          relationImportMatch: ['name', 'code'],
          required: true,
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
