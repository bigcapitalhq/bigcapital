import { Features } from '@/common/types/Features';

function StatusFieldFilterQuery(query, role) {
  query.modify('filterByStatus', role.value);
}

function StatusFieldSortQuery(query, role) {
  query.modify('sortByStatus', role.order);
}

export const VendorCreditMeta = {
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
  importAggregateBy: 'vendorCreditNumber',

  print: {
    pageTitle: 'Vendor Credits',
  },
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
  columns: {
    vendorId: {
      name: 'Vendor',
      type: 'relation',
      accessor: 'vendor.displayName',
    },
    exchangeRate: {
      name: 'Echange Rate',
      type: 'text',
      printable: false,
    },
    vendorCreditNumber: {
      name: 'Vendor Credit No.',
      type: 'text',
    },
    referenceNo: {
      name: 'Refernece No.',
      type: 'text',
    },
    vendorCreditDate: {
      name: 'Vendor Credit Date',
      accessor: 'formattedVendorCreditDate',
    },
    amount: {
      name: 'Amount',
      accessor: 'formattedAmount',
    },
    creditRemaining: {
      name: 'Credits Remaining',
      accessor: 'formattedCreditsRemaining',
      printable: false,
    },
    refundedAmount: {
      name: 'Refunded Amount',
      accessor: 'refundedAmount',
      printable: false,
    },
    invoicedAmount: {
      name: 'Invoiced Amount',
      accessor: 'formattedInvoicedAmount',
    },
    note: {
      name: 'Note',
      type: 'text',
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
    branch: {
      name: 'Branch',
      type: 'text',
      accessor: 'branch.name',
      features: [Features.BRANCHES],
    },
    warehouse: {
      name: 'Warehouse',
      type: 'text',
      accessor: 'warehouse.name',
      features: [Features.BRANCHES],
    },
  },
  fields2: {
    vendorId: {
      name: 'vendor_credit.field.vendor',
      fieldType: 'relation',
      relationModel: 'Contact',
      relationImportMatch: 'displayName',
      required: true,
    },
    exchangeRate: {
      name: 'vendor_credit.field.exchange_rate',
      fieldType: 'text',
    },
    vendorCreditNumber: {
      name: 'vendor_credit.field.vendor_credit_number',
      fieldType: 'text',
    },
    referenceNo: {
      name: 'vendor_credit.field.reference_no',
      fieldType: 'text',
    },
    vendorCreditDate: {
      name: 'vendor_credit.field.vendor_credit_date',
      fieldType: 'date',
      required: true,
    },
    note: {
      name: 'vendor_credit.field.note',
      fieldType: 'text',
    },
    open: {
      name: 'vendor_credit.field.open',
      fieldType: 'boolean',
    },
    entries: {
      name: 'vendor_credit.field.entries',
      fieldType: 'collection',
      collectionOf: 'object',
      collectionMinLength: 1,
      required: true,
      fields: {
        itemId: {
          name: 'vendor_credit.field.item',
          fieldType: 'relation',
          relationModel: 'Item',
          relationImportMatch: ['name', 'code'],
          required: true,
          importHint: 'invoice.field.item_hint',
        },
        rate: {
          name: 'vendor_credit.field.rate',
          fieldType: 'number',
          required: true,
        },
        quantity: {
          name: 'vendor_credit.field.quantity',
          fieldType: 'number',
          required: true,
        },
        description: {
          name: 'vendor_credit.field.description',
          fieldType: 'text',
        },
      },
    },
    branchId: {
      name: 'invoice.field.branch',
      fieldType: 'relation',
      relationModel: 'Branch',
      relationImportMatch: ['name', 'code'],
      features: [Features.BRANCHES],
      required: true
    },
    warehouseId: {
      name: 'invoice.field.warehouse',
      fieldType: 'relation',
      relationModel: 'Warehouse',
      relationImportMatch: ['name', 'code'],
      features: [Features.WAREHOUSES],
      required: true
    },
  },
};