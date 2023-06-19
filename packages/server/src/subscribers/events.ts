export default {
  /**
   * Authentication service.
   */
  auth: {
    signIn: 'onSignIn',
    signingIn: 'onSigningIn',

    signUp: 'onSignUp',
    signingUp: 'onSigningUp',

    sendingResetPassword: 'onSendingResetPassword',
    sendResetPassword: 'onSendResetPassword',

    resetPassword: 'onResetPassword',
    resettingPassword: 'onResettingPassword'
  },

  /**
   * Invite users service.
   */
  inviteUser: {
    acceptInvite: 'onUserAcceptInvite',
    sendInvite: 'onUserSendInvite',
    resendInvite: 'onUserInviteResend',
    checkInvite: 'onUserCheckInvite',
    sendInviteTenantSynced: 'onUserSendInviteTenantSynced',
  },

  /**
   * Organization management service.
   */
  organization: {
    build: 'onOrganizationBuild',
    seeded: 'onOrganizationSeeded',

    baseCurrencyUpdated: 'onOrganizationBaseCurrencyUpdated',
  },

  /**
   * Tenants management service.
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
    onCreating: 'onAccountCreating',
    onCreated: 'onAccountCreated',

    onEditing: 'onAccountEditing',
    onEdited: 'onAccountEdited',

    onDelete: 'onAccountDelete',
    onDeleted: 'onAccountDeleted',

    onBulkDeleted: 'onBulkDeleted',
    onBulkActivated: 'onAccountBulkActivated',

    onActivated: 'onAccountActivated',
  },

  /**
   * Manual journals service.
   */
  manualJournals: {
    onCreating: 'onManualJournalCreating',
    onCreated: 'onManualJournalCreated',

    onEditing: 'onManualJournalEditing',
    onEdited: 'onManualJournalEdited',

    onDeleting: 'onManualJournalDeleting',
    onDeleted: 'onManualJournalDeleted',

    onPublished: 'onManualJournalPublished',
    onPublishing: 'onManualJournalPublishing',
  },

  /**
   * Expenses service.
   */
  expenses: {
    onCreating: 'onExpenseCreating',
    onCreated: 'onExpenseCreated',

    onEditing: 'onExpenseEditing',
    onEdited: 'onExpenseEdited',

    onDeleting: 'onExpenseDeleting',
    onDeleted: 'onExpenseDeleted',

    onPublishing: 'onExpensePublishing',
    onPublished: 'onExpensePublished',
  },

  /**
   * Sales invoices service.
   */
  saleInvoice: {
    onCreate: 'onSaleInvoiceCreate',
    onCreating: 'onSaleInvoiceCreating',
    onCreated: 'onSaleInvoiceCreated',

    onEdit: 'onSaleInvoiceEdit',
    onEditing: 'onSaleInvoiceEditing',
    onEdited: 'onSaleInvoiceEdited',

    onDelete: 'onSaleInvoiceDelete',
    onDeleting: 'onSaleInvoiceDeleting',
    onDeleted: 'onSaleInvoiceDeleted',

    onDelivering: 'onSaleInvoiceDelivering',
    onDeliver: 'onSaleInvoiceDeliver',
    onDelivered: 'onSaleInvoiceDelivered',

    onPublish: 'onSaleInvoicePublish',
    onPublished: 'onSaleInvoicePublished',

    onWriteoff: 'onSaleInvoiceWriteoff',
    onWrittenoff: 'onSaleInvoiceWrittenoff',
    onWrittenoffCancel: 'onSaleInvoiceWrittenoffCancel',
    onWrittenoffCanceled: 'onSaleInvoiceWrittenoffCanceled',

    onNotifySms: 'onSaleInvoiceNotifySms',
    onNotifiedSms: 'onSaleInvoiceNotifiedSms',
  },

  /**
   * Sales estimates service.
   */
  saleEstimate: {
    onCreating: 'onSaleEstimateCreating',
    onCreated: 'onSaleEstimateCreated',

    onEditing: 'onSaleEstimateEditing',
    onEdited: 'onSaleEstimateEdited',

    onDeleting: 'onSaleEstimatedDeleting',
    onDeleted: 'onSaleEstimatedDeleted',

    onPublishing: 'onSaleEstimatedPublishing',
    onPublished: 'onSaleEstimatedPublished',

    onNotifySms: 'onSaleEstimateNotifySms',
    onNotifiedSms: 'onSaleEstimateNotifiedSms',

    onDelivering: 'onSaleEstimateDelivering',
    onDelivered: 'onSaleEstimateDelivered',

    onConvertedToInvoice: 'onSaleEstimateConvertedToInvoice',

    onApproving: 'onSaleEstimateApproving',
    onApproved: 'onSaleEstimateApproved',

    onRejecting: 'onSaleEstimateRejecting',
    onRejected: 'onSaleEstimateRejected',
  },

  /**
   * Sales receipts service.
   */
  saleReceipt: {
    onCreating: 'onSaleReceiptsCreating',
    onCreated: 'onSaleReceiptsCreated',

    onEditing: 'onSaleReceiptsEditing',
    onEdited: 'onSaleReceiptsEdited',

    onDeleting: 'onSaleReceiptsDeleting',
    onDeleted: 'onSaleReceiptsDeleted',

    onPublishing: 'onSaleReceiptPublishing',
    onPublished: 'onSaleReceiptPublished',

    onClosed: 'onSaleReceiptClosed',
    onClosing: 'onSaleReceiptClosing',

    onNotifySms: 'onSaleReceiptNotifySms',
    onNotifiedSms: 'onSaleReceiptNotifiedSms',
  },

  /**
   * Payment receipts service.
   */
  paymentReceive: {
    onCreated: 'onPaymentReceiveCreated',
    onCreating: 'onPaymentReceiveCreating',

    onEditing: 'onPaymentReceiveEditing',
    onEdited: 'onPaymentReceiveEdited',

    onDeleting: 'onPaymentReceiveDeleting',
    onDeleted: 'onPaymentReceiveDeleted',

    onPublishing: 'onPaymentReceivePublishing',
    onPublished: 'onPaymentReceivePublished',

    onNotifySms: 'onPaymentReceiveNotifySms',
    onNotifiedSms: 'onPaymentReceiveNotifiedSms',
  },

  /**
   * Bills service.
   */
  bill: {
    onCreating: 'onBillCreating',
    onCreated: 'onBillCreated',

    onEditing: 'onBillEditing',
    onEdited: 'onBillEdited',

    onDeleting: 'onBillDeleting',
    onDeleted: 'onBillDeleted',

    onPublishing: 'onBillPublishing',
    onPublished: 'onBillPublished',
  },

  /**
   * Bill payments service.
   */
  billPayment: {
    onCreating: 'onBillPaymentCreating',
    onCreated: 'onBillPaymentCreated',

    onEditing: 'onBillPaymentEditing',
    onEdited: 'onBillPaymentEdited',

    onDeleted: 'onBillPaymentDeleted',
    onDeleting: 'onBillPaymentDeleting',

    onPublishing: 'onBillPaymentPublishing',
    onPublished: 'onBillPaymentPublished',
  },

  /**
   * Customers services.
   */
  customers: {
    onCreating: 'onCustomerCreating',
    onCreated: 'onCustomerCreated',

    onEdited: 'onCustomerEdited',
    onEditing: 'onCustomerEditing',

    onDeleted: 'onCustomerDeleted',
    onDeleting: 'onCustomerDeleting',
    onBulkDeleted: 'onBulkDeleted',

    onOpeningBalanceChanging: 'onCustomerOpeningBalanceChanging',
    onOpeningBalanceChanged: 'onCustomerOpeningBalanceChanged',

    onActivating: 'onCustomerActivating',
    onActivated: 'onCustomerActivated',
  },

  /**
   * Vendors services.
   */
  vendors: {
    onCreated: 'onVendorCreated',
    onCreating: 'onVendorCreating',

    onEdited: 'onVendorEdited',
    onEditing: 'onVendorEditing',

    onDeleted: 'onVendorDeleted',
    onDeleting: 'onVendorDeleting',

    onOpeningBalanceChanging: 'onVendorOpeningBalanceChanging',
    onOpeningBalanceChanged: 'onVendorOpeningBalanceChanged',

    onActivating: 'onVendorActivating',
    onActivated: 'onVendorActivated',
  },

  /**
   * Items service.
   */
  item: {
    onCreated: 'onItemCreated',
    onCreating: 'onItemCreating',

    onEditing: 'onItemEditing',
    onEdited: 'onItemEdited',

    onDeleted: 'onItemDeleted',
    onDeleting: 'onItemDeleting',

    onActivating: 'onItemActivating',
    onActivated: 'onItemActivated',

    onInactivating: 'onInactivating',
    onInactivated: 'onItemInactivated',
  },

  /**
   * Item category service.
   */
  itemCategory: {
    onCreated: 'onItemCategoryCreated',
    onEdited: 'onItemCategoryEdited',
    onDeleted: 'onItemCategoryDeleted',
    onBulkDeleted: 'onItemCategoryBulkDeleted',
  },

  /**
   * Inventory service.
   */
  inventory: {
    onInventoryTransactionsCreated: 'onInventoryTransactionsCreated',
    onInventoryTransactionsDeleted: 'onInventoryTransactionsDeleted',

    onComputeItemCostJobScheduled: 'onComputeItemCostJobScheduled',
    onComputeItemCostJobStarted: 'onComputeItemCostJobStarted',
    onComputeItemCostJobCompleted: 'onComputeItemCostJobCompleted',

    onInventoryCostEntriesWritten: 'onInventoryCostEntriesWritten',

    onCostLotsGLEntriesBeforeWrite: 'onInventoryCostLotsGLEntriesBeforeWrite',
    onCostLotsGLEntriesWrite: 'onInventoryCostLotsGLEntriesWrite',
  },

  /**
   * Inventory adjustment service.
   */
  inventoryAdjustment: {
    onQuickCreating: 'onInventoryAdjustmentCreating',
    onQuickCreated: 'onInventoryAdjustmentQuickCreated',

    onCreated: 'onInventoryAdjustmentCreated',

    onDeleting: 'onInventoryAdjustmentDeleting',
    onDeleted: 'onInventoryAdjustmentDeleted',

    onPublishing: 'onInventoryAdjustmentPublishing',
    onPublished: 'onInventoryAdjustmentPublished',
  },

  /**
   * Bill landed cost.
   */
  billLandedCost: {
    onCreate: 'onBillLandedCostCreate',
    onCreated: 'onBillLandedCostCreated',
    onDelete: 'onBillLandedCostDelete',
    onDeleted: 'onBillLandedCostDeleted',
  },

  cashflow: {
    onOwnerContributionCreate: 'onCashflowOwnerContributionCreate',
    onOwnerContributionCreated: 'onCashflowOwnerContributionCreated',

    onOtherIncomeCreate: 'onCashflowOtherIncomeCreate',
    onOtherIncomeCreated: 'onCashflowOtherIncomeCreated',

    onTransactionCreating: 'onCashflowTransactionCreating',
    onTransactionCreated: 'onCashflowTransactionCreated',

    onTransactionDeleting: 'onCashflowTransactionDeleting',
    onTransactionDeleted: 'onCashflowTransactionDeleted',
  },

  /**
   * Roles service events.
   */
  roles: {
    onCreate: 'onRoleCreate',
    onCreated: 'onRoleCreated',
    onEdit: 'onRoleEdit',
    onEdited: 'onRoleEdited',
    onDelete: 'onRoleDelete',
    onDeleted: 'onRoleDeleted',
  },

  tenantUser: {
    onEdited: 'onTenantUserEdited',
    onDeleted: 'onTenantUserDeleted',
    onActivated: 'onTenantUserActivated',
    onInactivated: 'onTenantUserInactivated',
  },

  /**
   * Credit note service.
   */
  creditNote: {
    onCreate: 'onCreditNoteCreate',
    onCreating: 'onCreditNoteCreating',
    onCreated: 'onCreditNoteCreated',

    onEditing: 'onCreditNoteEditing',
    onEdit: 'onCreditNoteEdit',
    onEdited: 'onCreditNoteEdited',

    onDelete: 'onCreditNoteDelete',
    onDeleting: 'onCreditNoteDeleting',
    onDeleted: 'onCreditNoteDeleted',

    onOpen: 'onCreditNoteOpen',
    onOpening: 'onCreditNoteOpening',
    onOpened: 'onCreditNoteOpened',

    onRefundCreate: 'onCreditNoteRefundCreate',
    onRefundCreating: 'onCreditNoteRefundCreating',
    onRefundCreated: 'onCreditNoteRefundCreated',

    onRefundDelete: 'onCreditNoteRefundDelete',
    onRefundDeleting: 'onCreditNoteRefundDeleting',
    onRefundDeleted: 'onCreditNoteRefundDeleted',

    onApplyToInvoicesCreated: 'onCreditNoteApplyToInvoiceCreated',
    onApplyToInvoicesCreate: 'onCreditNoteApplyToInvoiceCreate',
    onApplyToInvoicesDeleted: 'onCreditNoteApplyToInvoiceDeleted',
  },

  /**
   * Vendor credit service.
   */
  vendorCredit: {
    onCreate: 'onVendorCreditCreate',
    onCreating: 'onVendorCreditCreating',
    onCreated: 'onVendorCreditCreated',

    onEdit: 'onVendorCreditEdit',
    onEditing: 'onVendorCreditEditing',
    onEdited: 'onVendorCreditEdited',

    onDelete: 'onVendorCreditDelete',
    onDeleting: 'onVendorCreditDeleting',
    onDeleted: 'onVendorCreditDeleted',

    onOpen: 'onVendorCreditOpen',
    onOpened: 'onVendorCreditOpened',

    onRefundCreating: 'onVendorCreditRefundCreating',
    onRefundCreate: 'onVendorCreditRefundCreate',
    onRefundCreated: 'onVendorCreditRefundCreated',

    onRefundDelete: 'onVendorCreditRefundDelete',
    onRefundDeleting: 'onVendorCreditRefundDeleting',
    onRefundDeleted: 'onVendorCreditRefundDeleted',

    onApplyToInvoicesCreated: 'onVendorCreditApplyToInvoiceCreated',
    onApplyToInvoicesCreate: 'onVendorCreditApplyToInvoiceCreate',
    onApplyToInvoicesDeleted: 'onVendorCreditApplyToInvoiceDeleted',
  },

  transactionsLocking: {
    locked: 'onTransactionLockingLocked',
    lockCanceled: 'onTransactionLockingLockCanceled',
    partialUnlocked: 'onTransactionLockingPartialUnlocked',
    partialUnlockCanceled: 'onTransactionLockingPartialUnlockCanceled',
  },

  warehouse: {
    onCreate: 'onWarehouseCreate',
    onCreated: 'onWarehouseCreated',

    onEdit: 'onWarehouseEdit',
    onEdited: 'onWarehouseEdited',

    onDelete: 'onWarehouseDelete',
    onDeleted: 'onWarehouseDeleted',

    onActivate: 'onWarehouseActivate',
    onActivated: 'onWarehouseActivated',

    onMarkPrimary: 'onWarehouseMarkPrimary',
    onMarkedPrimary: 'onWarehouseMarkedPrimary',
  },

  warehouseTransfer: {
    onCreate: 'onWarehouseTransferCreate',
    onCreated: 'onWarehouseTransferCreated',

    onEdit: 'onWarehouseTransferEdit',
    onEdited: 'onWarehouseTransferEdited',

    onDelete: 'onWarehouseTransferDelete',
    onDeleted: 'onWarehouseTransferDeleted',

    onInitiate: 'onWarehouseTransferInitiate',
    onInitiated: 'onWarehouseTransferInitiated',

    onTransfer: 'onWarehouseTransferInitiate',
    onTransferred: 'onWarehouseTransferTransferred',
  },

  /**
   * Branches.
   */
  branch: {
    onActivate: 'onBranchActivate',
    onActivated: 'onBranchActivated',

    onMarkPrimary: 'onBranchMarkPrimary',
    onMarkedPrimary: 'onBranchMarkedPrimary',
  },

  /**
   * Projects.
   */
  project: {
    onCreate: 'onProjectCreate',
    onCreating: 'onProjectCreating',
    onCreated: 'onProjectCreated',

    onEdit: 'onEditProject',
    onEditing: 'onEditingProject',
    onEdited: 'onEditedProject',

    onEditStatus: 'onEditStatusProject',
    onEditingStatus: 'onEditingStatusProject',
    onEditedStatus: 'onEditedStatusProject',

    onDelete: 'onDeleteProject',
    onDeleting: 'onDeletingProject',
    onDeleted: 'onDeletedProject',
  },

  /**
   * Project Tasks.
   */
  projectTask: {
    onCreate: 'onProjectTaskCreate',
    onCreating: 'onProjectTaskCreating',
    onCreated: 'onProjectTaskCreated',

    onEdit: 'onProjectTaskEdit',
    onEditing: 'onProjectTaskEditing',
    onEdited: 'onProjectTaskEdited',

    onDelete: 'onProjectTaskDelete',
    onDeleting: 'onProjectTaskDeleting',
    onDeleted: 'onProjectTaskDeleted',
  },

  /**
   * Project Times.
   */
  projectTime: {
    onCreate: 'onProjectTimeCreate',
    onCreating: 'onProjectTimeCreating',
    onCreated: 'onProjectTimeCreated',

    onEdit: 'onProjectTimeEdit',
    onEditing: 'onProjectTimeEditing',
    onEdited: 'onProjectTimeEdited',

    onDelete: 'onProjectTimeDelete',
    onDeleting: 'onProjectTimeDeleting',
    onDeleted: 'onProjectTimeDeleted',
  },
};
