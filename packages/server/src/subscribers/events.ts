export default {
  /**
   * Authentication service.
   */
  auth: {
    signIn: 'onSignIn',
    signingIn: 'onSigningIn',

    signUp: 'onSignUp',
    signingUp: 'onSigningUp',

    signUpConfirming: 'signUpConfirming',
    signUpConfirmed: 'signUpConfirmed',

    sendingResetPassword: 'onSendingResetPassword',
    sendResetPassword: 'onSendResetPassword',

    resetPassword: 'onResetPassword',
    resetingPassword: 'onResetingPassword',
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
   * Organization managment service.
   */
  organization: {
    build: 'onOrganizationBuild',
    built: 'onOrganizationBuilt',

    seeded: 'onOrganizationSeeded',

    baseCurrencyUpdated: 'onOrganizationBaseCurrencyUpdated',
  },

  /**
   * Organization subscription.
   */
  subscription: {
    onSubscriptionCancel: 'onSubscriptionCancel',
    onSubscriptionCancelled: 'onSubscriptionCancelled',

    onSubscriptionResume: 'onSubscriptionResume',
    onSubscriptionResumed: 'onSubscriptionResumed',

    onSubscriptionPlanChange: 'onSubscriptionPlanChange',
    onSubscriptionPlanChanged: 'onSubscriptionPlanChanged',

    onSubscriptionSubscribed: 'onSubscriptionSubscribed',

    onSubscriptionPaymentSucceed: 'onSubscriptionPaymentSucceed',
    onSubscriptionPaymentFailed: 'onSubscriptionPaymentFailed',
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
    onViewed: 'onAccountViewed',
    onListViewed: 'onAccountsListViewed',

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
    onViewed: 'onSaleInvoiceItemViewed',
    onListViewed: 'onSaleInvoiceListViewed',

    onPdfViewed: 'onSaleInvoicePdfViewed',

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

    onNotifyMail: 'onSaleInvoiceNotifyMail',
    onNotifyReminderMail: 'onSaleInvoiceNotifyReminderMail',

    onPreMailSend: 'onSaleInvoicePreMailSend',
    onMailSend: 'onSaleInvoiceMailSend',
    onMailSent: 'onSaleInvoiceMailSent',

    onMailReminderSend: 'onSaleInvoiceMailReminderSend',
    onMailReminderSent: 'onSaleInvoiceMailReminderSent',

    onPublicLinkGenerating: 'onPublicSharableLinkGenerating',
    onPublicLinkGenerated: 'onPublicSharableLinkGenerated',
  },

  /**
   * Sales estimates service.
   */
  saleEstimate: {
    onViewed: 'onSaleEstimateViewed',
    onPdfViewed: 'onSaleEstimatePdfViewed',

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

    onNotifyMail: 'onSaleEstimateNotifyMail',

    onPreMailSend: 'onSaleEstimatePreMailSend',
    onMailSend: 'onSaleEstimateMailSend',
    onMailSent: 'onSaleEstimateMailSent',
  },

  /**
   * Sales receipts service.
   */
  saleReceipt: {
    onPdfViewed: 'onSaleReceiptPdfViewed',

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

    onPreMailSend: 'onSaleReceiptPreMailSend',
    onMailSend: 'onSaleReceiptMailSend',
    onMailSent: 'onSaleReceiptMailSent',
  },

  /**
   * Payment receipts service.
   */
  paymentReceive: {
    onPdfViewed: 'onPaymentReceivedPdfViewed',

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

    onPreMailSend: 'onPaymentReceivePreMailSend',
    onMailSend: 'onPaymentReceiveMailSend',
    onMailSent: 'onPaymentReceiveMailSent',
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

    onOpening: 'onBillOpening',
    onOpened: 'onBillOpened',
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
    onOpeningBalanceChanged: 'onCustomerOpeingBalanceChanged',

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

    onOpeningBalanceChanging: 'onVendorOpeingBalanceChanging',
    onOpeningBalanceChanged: 'onVendorOpeingBalanceChanged',

    onActivating: 'onVendorActivating',
    onActivated: 'onVendorActivated',
  },

  /**
   * Items service.
   */
  item: {
    onViewed: 'onItemViewed',

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

    onTransactionCategorizing: 'onTransactionCategorizing',
    onTransactionCategorized: 'onCashflowTransactionCategorized',

    onTransactionUncategorizedCreating: 'onTransactionUncategorizedCreating',
    onTransactionUncategorizedCreated: 'onTransactionUncategorizedCreated',

    onTransactionUncategorizing: 'onTransactionUncategorizing',
    onTransactionUncategorized: 'onTransactionUncategorized',

    onTransactionCategorizingAsExpense: 'onTransactionCategorizingAsExpense',
    onTransactionCategorizedAsExpense: 'onTransactionCategorizedAsExpense',
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
    onPdfViewed: 'onCreditNotePdfViewed',

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
    onInitiated: 'onWarehouseTransferInitated',

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

  taxRates: {
    onCreating: 'onTaxRateCreating',
    onCreated: 'onTaxRateCreated',

    onEditing: 'onTaxRateEditing',
    onEdited: 'onTaxRateEdited',

    onDeleting: 'onTaxRateDeleting',
    onDeleted: 'onTaxRateDeleted',

    onActivating: 'onTaxRateActivating',
    onActivated: 'onTaxRateActivated',

    onInactivating: 'onTaxRateInactivating',
    onInactivated: 'onTaxRateInactivated',
  },

  plaid: {
    onItemCreated: 'onPlaidItemCreated',
    onTransactionsSynced: 'onPlaidTransactionsSynced',
  },

  // Bank rules.
  bankRules: {
    onCreating: 'onBankRuleCreating',
    onCreated: 'onBankRuleCreated',

    onEditing: 'onBankRuleEditing',
    onEdited: 'onBankRuleEdited',

    onDeleting: 'onBankRuleDeleting',
    onDeleted: 'onBankRuleDeleted',
  },

  // Bank matching.
  bankMatch: {
    onMatching: 'onBankTransactionMatching',
    onMatched: 'onBankTransactionMatched',

    onUnmatching: 'onBankTransactionUnmathcing',
    onUnmatched: 'onBankTransactionUnmathced',
  },

  bankTransactions: {
    onExcluding: 'onBankTransactionExclude',
    onExcluded: 'onBankTransactionExcluded',

    onUnexcluding: 'onBankTransactionUnexcluding',
    onUnexcluded: 'onBankTransactionUnexcluded',

    onPendingRemoving: 'onBankTransactionPendingRemoving',
    onPendingRemoved: 'onBankTransactionPendingRemoved',
  },

  bankAccount: {
    onDisconnecting: 'onBankAccountDisconnecting',
    onDisconnected: 'onBankAccountDisconnected',
  },

  // Import files.
  import: {
    onImportCommitted: 'onImportFileCommitted',
  },

  // Branding templates
  pdfTemplate: {
    onCreating: 'onPdfTemplateCreating',
    onCreated: 'onPdfTemplateCreated',

    onEditing: 'onPdfTemplateEditing',
    onEdited: 'onPdfTemplatedEdited',

    onDeleting: 'onPdfTemplateDeleting',
    onDeleted: 'onPdfTemplateDeleted',

    onAssignedDefault: 'onPdfTemplateAssignedDefault',
    onAssigningDefault: 'onPdfTemplateAssigningDefault',
  },

  // Payment method.
  paymentMethod: {
    onEditing: 'onPaymentMethodEditing',
    onEdited: 'onPaymentMethodEdited',

    onDeleted: 'onPaymentMethodDeleted',
  },

  // Payment methods integrations
  paymentIntegrationLink: {
    onPaymentIntegrationLink: 'onPaymentIntegrationLink',
    onPaymentIntegrationDeleteLink: 'onPaymentIntegrationDeleteLink',
  },

  // Stripe Payment Integration
  stripeIntegration: {
    onAccountCreated: 'onStripeIntegrationAccountCreated',
    onAccountDeleted: 'onStripeIntegrationAccountDeleted',

    onPaymentLinkCreated: 'onStripePaymentLinkCreated',
    onPaymentLinkInactivated: 'onStripePaymentLinkInactivated',

    onOAuthCodeGranted: 'onStripeOAuthCodeGranted',
  },

  // Stripe Payment Webhooks
  stripeWebhooks: {
    onCheckoutSessionCompleted: 'onStripeCheckoutSessionCompleted',
    onAccountUpdated: 'onStripeAccountUpdated',
  },

  // Reports
  reports: {
    onBalanceSheetViewed: 'onBalanceSheetViewed',
    onTrialBalanceSheetView: 'onTrialBalanceSheetViewed',
    onProfitLossSheetViewed: 'onProfitLossSheetViewed',
    onCashflowStatementViewed: 'onCashflowStatementViewed',
    onGeneralLedgerViewed: 'onGeneralLedgerViewed',
    onJournalViewed: 'onJounralViewed',
    onReceivableAgingViewed: 'onReceivableAgingViewed',
    onPayableAgingViewed: 'onPayableAgingViewed',
    onCustomerBalanceSummaryViewed: 'onInventoryValuationViewed',
    onVendorBalanceSummaryViewed: 'onVendorBalanceSummaryViewed',
    onInventoryValuationViewed: 'onCustomerBalanceSummaryViewed',
    onCustomerTransactionsViewed: 'onCustomerTransactionsViewed',
    onVendorTransactionsViewed: 'onVendorTransactionsViewed',
    onSalesByItemViewed: 'onSalesByItemViewed',
    onPurchasesByItemViewed: 'onPurchasesByItemViewed',
  },
};
