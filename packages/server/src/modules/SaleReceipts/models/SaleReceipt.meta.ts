import { Features } from '@/common/types/Features';

export const SaleReceiptMeta = {
  defaultFilterField: 'receipt_date',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'created_at',
  },
  exportable: true,
  exportFlattenOn: 'entries',

  importable: true,
  importAggregator: 'group',
  importAggregateOn: 'entries',
  importAggregateBy: 'receiptNumber',

  print: {
    pageTitle: 'Sale Receipts',
  },
  fields: {
    amount: {
      name: 'receipt.field.amount',
      column: 'amount',
      fieldType: 'number',
    },
    deposit_account: {
      column: 'deposit_account_id',
      name: 'receipt.field.deposit_account',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'depositAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',
    },
    customer: {
      name: 'receipt.field.customer',
      column: 'customer_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'customer',

      relationEntityLabel: 'display_name',
      relationEntityKey: 'id',
    },
    receipt_date: {
      name: 'receipt.field.receipt_date',
      column: 'receipt_date',
      fieldType: 'date',
    },
    receipt_number: {
      name: 'receipt.field.receipt_number',
      column: 'receipt_number',
      fieldType: 'text',
    },
    reference_no: {
      name: 'receipt.field.reference_no',
      column: 'reference_no',
      fieldType: 'text',
    },
    receipt_message: {
      name: 'receipt.field.receipt_message',
      column: 'receipt_message',
      fieldType: 'text',
    },
    statement: {
      name: 'receipt.field.statement',
      column: 'statement',
      fieldType: 'text',
    },
    created_at: {
      name: 'receipt.field.created_at',
      column: 'created_at',
      fieldType: 'date',
    },
    status: {
      name: 'receipt.field.status',
      fieldType: 'enumeration',
      options: [
        { key: 'draft', label: 'receipt.field.status.draft' },
        { key: 'closed', label: 'receipt.field.status.closed' },
      ],
      filterCustomQuery: StatusFieldFilterQuery,
      sortCustomQuery: StatusFieldSortQuery,
    },
  },
  columns: {
    depositAccount: {
      name: 'receipt.field.deposit_account',
      type: 'text',
      accessor: 'depositAccount.name',
    },
    customer: {
      name: 'receipt.field.customer',
      type: 'text',
      accessor: 'customer.displayName',
    },
    receiptDate: {
      name: 'receipt.field.receipt_date',
      accessor: 'formattedReceiptDate',
      type: 'date',
    },
    receiptNumber: {
      name: 'receipt.field.receipt_number',
      type: 'text',
    },
    referenceNo: {
      name: 'receipt.field.reference_no',
      column: 'reference_no',
      type: 'text',
      exportable: true,
    },
    receiptMessage: {
      name: 'receipt.field.receipt_message',
      column: 'receipt_message',
      type: 'text',
      printable: false,
    },
    amount: {
      name: 'receipt.field.amount',
      accessor: 'formattedAmount',
      type: 'number',
    },
    statement: {
      name: 'receipt.field.statement',
      type: 'text',
      printable: false,
    },
    status: {
      name: 'receipt.field.status',
      type: 'enumeration',
      options: [
        { key: 'draft', label: 'receipt.field.status.draft' },
        { key: 'closed', label: 'receipt.field.status.closed' },
      ],
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
    createdAt: {
      name: 'receipt.field.created_at',
      type: 'date',
      printable: false,
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
    receiptDate: {
      name: 'receipt.field.receipt_date',
      fieldType: 'date',
      required: true,
    },
    customerId: {
      name: 'receipt.field.customer',
      fieldType: 'relation',
      relationModel: 'Contact',
      relationImportMatch: 'displayName',
      required: true,
    },
    depositAccountId: {
      name: 'receipt.field.deposit_account',
      fieldType: 'relation',
      relationModel: 'Account',
      relationImportMatch: ['name', 'code'],
      required: true,
    },
    exchangeRate: {
      name: 'receipt.field.exchange_rate',
      fieldType: 'number',
    },
    receiptNumber: {
      name: 'receipt.field.receipt_number',
      fieldType: 'text',
    },
    referenceNo: {
      name: 'receipt.field.reference_no',
      fieldType: 'text',
    },
    closed: {
      name: 'receipt.field.closed',
      fieldType: 'boolean',
    },
    entries: {
      name: 'receipt.field.entries',
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
          importHint: 'invoice.field.item_hint',
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
    statement: {
      name: 'receipt.field.statement',
      fieldType: 'text',
    },
    receiptMessage: {
      name: 'receipt.field.receipt_message',
      fieldType: 'text',
    },
    branchId: {
      name: 'invoice.field.branch',
      fieldType: 'relation',
      relationModel: 'Branch',
      relationImportMatch: ['name', 'code'],
      features: [Features.BRANCHES],
      required: true,
    },
    warehouseId: {
      name: 'invoice.field.warehouse',
      fieldType: 'relation',
      relationModel: 'Warehouse',
      relationImportMatch: ['name', 'code'],
      features: [Features.WAREHOUSES],
      required: true,
    },
  },
};

function StatusFieldFilterQuery(query, role) {
  query.modify('filterByStatus', role.value);
}

function StatusFieldSortQuery(query, role) {
  query.modify('sortByStatus', role.order);
}
