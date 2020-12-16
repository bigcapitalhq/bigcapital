
export default {
  /**
   * Authentication service.
   */
  auth: {
    login: 'onLogin',
    register: 'onRegister',
    sendResetPassword: 'onSendResetPassword',
    resetPassword: 'onResetPassword',
  },

  /**
   * Invite users service.
   */
  inviteUser: {
    acceptInvite: 'onUserAcceptInvite',
    sendInvite: 'onUserSendInvite',
    checkInvite: 'onUserCheckInvite'
  },

  /**
   * Organization managment service.
   */
  organization: {
    build: 'onOrganizationBuild',
    seeded: 'onOrganizationSeeded',
  },

  /**
   * Tenants managment service.
   */
  tenantManager: {
    databaseCreated: 'onDatabaseCreated',
    tenantMigrated: 'onTenantMigrated',
    tenantSeeded: 'onTenantSeeded',
  },

  /**
   * Accounts service.
   */
  accounts: {
    onCreated: 'onAccountCreated',
    onEdited: 'onAccountEdited',
    onDeleted: 'onAccountDeleted',
    onBulkDeleted: 'onBulkDeleted',
    onBulkActivated: 'onAccountBulkActivated',
    onActivated: 'onAccountActivated'
  },

  /**
   * Manual journals service.
   */
  manualJournals: {
    onCreated: 'onManualJournalCreated',
    onEdited: 'onManualJournalEdited',
    onDeleted: 'onManualJournalDeleted',
    onDeletedBulk: 'onManualJournalCreatedBulk',
    onPublished: 'onManualJournalPublished',
    onPublishedBulk: 'onManualJournalPublishedBulk',
  },

  /**
   * Expenses service.
   */
  expenses: {
    onCreated: 'onExpenseCreated',
    onEdited: 'onExpenseEdited',
    onDeleted: 'onExpenseDelted',
    onPublished: 'onExpensePublished',

    onBulkDeleted: 'onExpenseBulkDeleted',
    onBulkPublished: 'onBulkPublished',
  },

  /**
   * Sales invoices service.
   */
  saleInvoice: {
    onCreated: 'onSaleInvoiceCreated',
    onEdited: 'onSaleInvoiceEdited',
    onDeleted: 'onSaleInvoiceDeleted',
    onBulkDelete: 'onSaleInvoiceBulkDeleted',
    onPublished: 'onSaleInvoicePublished',
  },

  /**
   * Sales estimates service.
   */
  saleEstimate: {
    onCreated: 'onSaleEstimateCreated',
    onEdited: 'onSaleEstimateEdited',
    onDeleted: 'onSaleEstimatedDeleted',
    onBulkDelete: 'onSaleEstimatedBulkDeleted',
    onPublished: 'onSaleEstimatedPublished',
  },

  /**
   * Sales receipts service.
   */
  saleReceipt: {
    onCreated: 'onSaleReceiptsCreated',
    onEdited: 'onSaleReceiptsEdited',
    onDeleted: 'onSaleReceiptsDeleted',
    onBulkDeleted: 'onSaleReceiptsBulkDeleted',
    onPublished: 'onSaleReceiptPublished',
  },

  /**
   * Payment receipts service.
   */
  paymentReceive: {
    onCreated: 'onPaymentReceiveCreated',
    onEdited: 'onPaymentReceiveEdited',
    onDeleted: 'onPaymentReceiveDeleted',
    onPublished: 'onPaymentReceivePublished',
  },

  /**
   * Bills service.
   */
  bill: {
    onCreated: 'onBillCreated',
    onEdited: 'onBillEdited',
    onDeleted: 'onBillDeleted',
    onBulkDeleted: 'onBillBulkDeleted',
    onPublished: 'onBillPublished',
  },

  /**
   * Bill payments service.
   */
  billPayment: {
    onCreated: 'onBillPaymentCreated',
    onEdited: 'onBillPaymentEdited',
    onDeleted: 'onBillPaymentDeleted',
    onBulkDeleted: 'onBillPaymentsBulkDeleted',
    onPublished: 'onBillPaymentPublished',
  },

  /**
   * Customers services.
   */
  customers: {
    onCreated: 'onCustomerCreated',
    onEdited: 'onCustomerEdited',
    onDeleted: 'onCustomerDeleted',
    onBulkDeleted: 'onBulkDeleted',
    onOpeningBalanceChanged: 'onOpeingBalanceChanged',
  },

  /**
   * Vendors services.
   */
  vendors: {
    onCreated: 'onVendorCreated',
    onEdited: 'onVendorEdited',
    onDeleted: 'onVendorDeleted',
    onBulkDeleted: 'onVendorBulkDeleted',
    onOpeningBalanceChanged: 'onOpeingBalanceChanged',
  },

  items: {
    onCreated: 'onItemCreated',
    onEdited: 'onItemEdited',
    onDeleted: 'onItemDeleted',
    onBulkDeleted: 'onItemBulkDeleted',
  }
}
