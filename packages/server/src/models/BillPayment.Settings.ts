export default {
  defaultFilterField: 'vendor',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'bill_date',
  },
  exportable: true,
  importable: true,
  importAggregator: 'group',
  importAggregateOn: 'entries',
  importAggregateBy: 'paymentNumber',
  fields: {
    vendor: {
      name: 'bill_payment.field.vendor',
      column: 'vendor_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'vendor',

      relationEntityLabel: 'display_name',
      relationEntityKey: 'id',
    },
    amount: {
      name: 'bill_payment.field.amount',
      column: 'amount',
      fieldType: 'number',
    },
    due_amount: {
      name: 'bill_payment.field.due_amount',
      column: 'due_amount',
      fieldType: 'number',
    },
    payment_account: {
      name: 'bill_payment.field.payment_account',
      column: 'payment_account_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'paymentAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',
    },
    payment_number: {
      name: 'bill_payment.field.payment_number',
      column: 'payment_number',
      fieldType: 'text',
    },
    payment_date: {
      name: 'bill_payment.field.payment_date',
      column: 'payment_date',
      fieldType: 'date',
    },
    reference_no: {
      name: 'bill_payment.field.reference_no',
      column: 'reference',
      fieldType: 'text',
    },
    description: {
      name: 'bill_payment.field.description',
      column: 'description',
      fieldType: 'text',
    },
    created_at: {
      name: 'bill_payment.field.created_at',
      column: 'created_at',
      fieldType: 'date',
    },
  },
  columns: {
    vendor: {
      name: 'bill_payment.field.vendor',
      type: 'relation',
      accessor: 'vendor.displayName',
    },
    paymentDate: {
      name: 'bill_payment.field.payment_date',
      type: 'date',
      accessor: 'formattedPaymentDate'
    },
    paymentNumber: {
      name: 'bill_payment.field.payment_number',
      type: 'text',
    },
    paymentAccount: {
      name: 'bill_payment.field.payment_account',
      accessor: 'paymentAccount.name',
      type: 'text',
    },
    amount: {
      name: 'Amount',
      accessor: 'formattedAmount',
    },
    currencyCode: {
      name: 'Currency Code',
      type: 'text',
      printable: false,
    },
    exchangeRate: {
      name: 'bill_payment.field.exchange_rate',
      type: 'number',
      printable: false,
    },
    statement: {
      name: 'bill_payment.field.note',
      type: 'text',
      printable: false,
    },
    reference: {
      name: 'bill_payment.field.reference',
      type: 'text',
    },
  },
  fields2: {
    vendorId: {
      name: 'bill_payment.field.vendor',
      fieldType: 'relation',
      relationModel: 'Contact',
      relationImportMatch: ['displayName'],
      required: true,
    },
    payment_date: {
      name: 'bill_payment.field.payment_date',
      fieldType: 'date',
      required: true,
    },
    paymentNumber: {
      name: 'bill_payment.field.payment_number',
      fieldType: 'text',
      unique: true,
      importHint: 'The payment number should be unique.',
    },
    paymentAccountId: {
      name: 'bill_payment.field.payment_account',
      fieldType: 'relation',
      relationModel: 'Account',
      relationImportMatch: ['name', 'code'],
      required: true,
      importHint: 'Matches the account name or code.',
    },
    exchangeRate: {
      name: 'bill_payment.field.exchange_rate',
      fieldType: 'number',
    },
    statement: {
      name: 'bill_payment.field.note',
      fieldType: 'text',
    },
    reference: {
      name: 'bill_payment.field.reference',
      fieldType: 'text',
    },
    entries: {
      name: 'bill_payment.field.entries',
      column: 'entries',
      fieldType: 'collection',
      collectionOf: 'object',
      collectionMinLength: 1,
      required: true,
      fields: {
        billId: {
          name: 'bill_payment.field.entries.bill',
          fieldType: 'relation',
          relationModel: 'Bill',
          relationImportMatch: 'billNumber',
          required: true,
          importHint: 'Matches the bill number.',
        },
        paymentAmount: {
          name: 'bill_payment.field.entries.payment_amount',
          fieldType: 'number',
          required: true,
        },
      },
    },
  },
};
