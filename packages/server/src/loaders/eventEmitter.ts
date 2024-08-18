import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';

import InventoryAdjustmentsSubscriber from '@/subscribers/Inventory/InventoryAdjustment';
import BillWriteInventoryTransactionsSubscriber from '@/subscribers/Bills/WriteInventoryTransactions';
import PaymentSyncBillBalance from '@/subscribers/PaymentMades/PaymentSyncBillBalance';
import SaleReceiptInventoryTransactionsSubscriber from '@/subscribers/SaleReceipt/WriteInventoryTransactions';
import SaleInvoiceWriteInventoryTransactions from '@/subscribers/SaleInvoices/WriteInventoryTransactions';
import SaleInvoiceWriteGLEntriesSubscriber from '@/subscribers/SaleInvoices/WriteJournalEntries';
import SaleReceiptWriteGLEntriesSubscriber from '@/subscribers/SaleReceipt/WriteJournalEntries';
import PaymentReceiveSyncInvoices from '@/subscribers/PaymentReceive/PaymentReceiveSyncInvoices';
import CashflowTransactionSubscriber from '@/services/Cashflow/CashflowTransactionSubscriber';
import PaymentReceivesWriteGLEntriesSubscriber from '@/subscribers/PaymentReceive/WriteGLEntries';
import InventorySubscriber from '@/subscribers/Inventory/Inventory';
import { CustomerWriteGLOpeningBalanceSubscriber } from '@/services/Contacts/Customers/Subscribers/CustomerGLEntriesSubscriber';
import { VendorsWriteGLOpeningSubscriber } from '@/services/Contacts/Vendors/Subscribers/VendorGLEntriesSubscriber';
import SaleEstimateAutoSerialSubscriber from '@/subscribers/SaleEstimate/AutoIncrementSerial';
import SaleEstimateSmsNotificationSubscriber from '@/subscribers/SaleEstimate/SmsNotifications';
import { ExpensesWriteGLSubscriber } from '@/services/Expenses/ExpenseGLEntriesSubscriber';
import SaleReceiptAutoSerialSubscriber from '@/subscribers/SaleReceipt/AutoIncrementSerial';
import SaleInvoiceAutoIncrementSubscriber from '@/subscribers/SaleInvoices/AutoIncrementSerial';
import SaleInvoiceConvertFromEstimateSubscriber from '@/subscribers/SaleInvoices/ConvertFromEstimate';
import PaymentReceiveAutoSerialSubscriber from '@/subscribers/PaymentReceive/AutoSerialIncrement';
import SyncSystemSendInvite from '@/services/InviteUsers/SyncSystemSendInvite';
import InviteSendMainNotification from '@/services/InviteUsers/InviteSendMailNotificationSubscribe';
import SyncTenantAcceptInvite from '@/services/InviteUsers/SyncTenantAcceptInvite';
import SyncTenantUserMutate from '@/services/Users/SyncTenantUserSaved';
import { SyncTenantUserDelete } from '@/services/Users/SyncTenantUserDeleted';
import OrgSyncTenantAdminUserSubscriber from '@/subscribers/Organization/SyncTenantAdminUser';
import OrgBuildSmsNotificationSubscriber from '@/subscribers/Organization/BuildSmsNotification';
import PurgeUserAbilityCache from '@/services/Users/PurgeUserAbilityCache';
import ResetLoginThrottleSubscriber from '@/subscribers/Authentication/ResetLoginThrottle';
import AuthenticationSubscriber from '@/subscribers/Authentication/SendResetPasswordMail';
import PurgeAuthorizedUserOnceRoleMutate from '@/services/Roles/PurgeAuthorizedUser';
import SendSmsNotificationToCustomer from '@/subscribers/SaleInvoices/SendSmsNotificationToCustomer';
import SendSmsNotificationSaleReceipt from '@/subscribers/SaleReceipt/SendSmsNotificationToCustomer';
import SendSmsNotificationPaymentReceive from '@/subscribers/PaymentReceive/SendSmsNotificationToCustomer';
import SaleInvoiceWriteoffSubscriber from '@/services/Sales/Invoices/SaleInvoiceWriteoffSubscriber';
import LandedCostSyncCostTransactionsSubscriber from '@/services/Purchases/LandedCost/LandedCostSyncCostTransactionsSubscriber';
import LandedCostInventoryTransactionsSubscriber from '@/services/Purchases/LandedCost/LandedCostInventoryTransactionsSubscriber';
import CreditNoteGLEntriesSubscriber from '@/services/CreditNotes/CreditNoteGLEntriesSubscriber';
import VendorCreditGlEntriesSubscriber from '@/services/Purchases/VendorCredits/VendorCreditGLEntriesSubscriber';
import CreditNoteInventoryTransactionsSubscriber from '@/services/CreditNotes/CreditNoteInventoryTransactionsSubscriber';
import VendorCreditInventoryTransactionsSubscriber from '@/services/Purchases/VendorCredits/VendorCreditInventoryTransactionsSusbcriber';
import CreditNoteAutoSerialSubscriber from '@/services/CreditNotes/CreditNoteAutoSerialSubscriber';
import VendorCreditAutoSerialSubscriber from '@/services/Purchases/VendorCredits/VendorCreditAutoSerialSubscriber';
import LandedCostGLEntriesSubscriber from '@/services/Purchases/LandedCost/LandedCostGLEntriesSubscriber';
import RefundCreditNoteGLEntriesSubscriber from '@/services/CreditNotes/RefundCreditNoteGLEntriesSubscriber';
import RefundVendorCreditGLEntriesSubscriber from '@/services/Purchases/VendorCredits/RefundVendorCredits/RefundVendorCreditGLEntriesSubscriber';
import RefundSyncCreditNoteBalanceSubscriber from '@/services/CreditNotes/RefundSyncCreditNoteBalanceSubscriber';
import RefundSyncVendorCreditBalanceSubscriber from '@/services/Purchases/VendorCredits/RefundVendorCredits/RefundSyncVendorCreditBalanceSubscriber';
import CreditNoteApplySyncCreditSubscriber from '@/services/CreditNotes/CreditNoteApplySyncCreditSubscriber';
import CreditNoteApplySyncInvoicesCreditedAmountSubscriber from '@/services/CreditNotes/CreditNoteApplySyncInvoicesSubscriber';
import ApplyVendorCreditSyncInvoicedSubscriber from '@/services/Purchases/VendorCredits/ApplyVendorCreditToBills/ApplyVendorCreditSyncInvoicedSubscriber';
import ApplyVendorCreditSyncBillsSubscriber from '@/services/Purchases/VendorCredits/ApplyVendorCreditToBills/ApplyVendorCreditSyncBillsSubscriber';
import DeleteCustomerLinkedCreditSubscriber from '@/services/CreditNotes/DeleteCustomerLinkedCreditSubscriber';
import DeleteVendorAssociatedVendorCredit from '@/services/Purchases/VendorCredits/DeleteVendorAssociatedVendorCredit';
import SalesTransactionLockingGuardSubscriber from '@/services/TransactionsLocking/SalesTransactionLockingGuardSubscriber';
import PurchasesTransactionLockingGuardSubscriber from '@/services/TransactionsLocking/PurchasesTransactionLockingGuardSubscriber';
import FinancialTransactionLockingGuardSubscriber from '@/services/TransactionsLocking/FinancialsTransactionLockingGuardSubscriber';
import CashflowWithAccountSubscriber from '@/services/Cashflow/CashflowWithAccountSubscriber';
import { WarehousesItemsQuantitySyncSubscriber } from '@/services/Warehouses/Integrations/WarehousesItemsQuantitySynSubscriber';
import { WarehouseTransferInventoryTransactionsSubscriber } from '@/services/Warehouses/WarehousesTransfers/WarehouseTransferInventoryTransactionsSubscriber';
import { AccountsTransactionsWarehousesSubscribe } from '@/services/Accounting/AccountsTransactionsWarehousesSubscribe';
import { ActivateWarehousesSubscriber } from '@/services/Warehouses/ActivateWarehousesSubscriber';
import { ManualJournalWriteGLSubscriber } from '@/services/ManualJournals/ManualJournalGLEntriesSubscriber';
import { BillGLEntriesSubscriber } from '@/services/Purchases/Bills/BillGLEntriesSubscriber';
import { PaymentWriteGLEntriesSubscriber } from '@/services/Purchases/BillPayments/BillPaymentGLEntriesSubscriber';
import BranchesIntegrationsSubscribers from '@/services/Branches/EventsProvider';
import WarehousesIntegrationsSubscribers from '@/services/Warehouses/EventsProvider';
import { WarehouseTransferAutoIncrementSubscriber } from '@/services/Warehouses/WarehousesTransfers/WarehouseTransferAutoIncrementSubscriber';
import { InvoicePaymentGLRewriteSubscriber } from '@/services/Sales/Invoices/subscribers/InvoicePaymentGLRewriteSubscriber';
import { BillPaymentsGLEntriesRewriteSubscriber } from '@/services/Purchases/Bills/BillPaymentsGLEntriesRewriteSubscriber';
import { InvoiceCostGLEntriesSubscriber } from '@/services/Sales/Invoices/subscribers/InvoiceCostGLEntriesSubscriber';
import { InventoryCostGLBeforeWriteSubscriber } from '@/services/Inventory/subscribers/InventoryCostGLBeforeWriteSubscriber';
import { SaleReceiptCostGLEntriesSubscriber } from '@/services/Sales/Receipts/subscribers/SaleReceiptCostGLEntriesSubscriber';
import { SeedInitialCurrenciesOnSetupSubsriber } from '@/services/Currencies/subscribers/SeedInitialCurrenciesOnSetupSubscriber';
import { MutateBaseCurrencyAccountsSubscriber } from '@/services/Accounts/susbcribers/MutateBaseCurrencyAccounts';
import { ProjectBillableTasksSubscriber } from '@/services/Projects/Projects/ProjectBillableTasksSubscriber';
import { ProjectBillableExpensesSubscriber } from '@/services/Projects/Projects/ProjectBillableExpenseSubscriber';
import { ProjectBillableBillSubscriber } from '@/services/Projects/Projects/ProjectBillableBillSubscriber';
import { SyncActualTimeTaskSubscriber } from '@/services/Projects/Times/SyncActualTimeTaskSubscriber';
import { SaleInvoiceTaxRateValidateSubscriber } from '@/services/TaxRates/subscribers/SaleInvoiceTaxRateValidateSubscriber';
import { WriteInvoiceTaxTransactionsSubscriber } from '@/services/TaxRates/subscribers/WriteInvoiceTaxTransactionsSubscriber';
import { BillTaxRateValidateSubscriber } from '@/services/TaxRates/subscribers/BillTaxRateValidateSubscriber';
import { WriteBillTaxTransactionsSubscriber } from '@/services/TaxRates/subscribers/WriteBillTaxTransactionsSubscriber';
import { SyncItemTaxRateOnEditTaxSubscriber } from '@/services/TaxRates/SyncItemTaxRateOnEditTaxSubscriber';
import { PlaidUpdateTransactionsOnItemCreatedSubscriber } from '@/services/Banking/Plaid/subscribers/PlaidUpdateTransactionsOnItemCreatedSubscriber';
import { InvoiceChangeStatusOnMailSentSubscriber } from '@/services/Sales/Invoices/subscribers/InvoiceChangeStatusOnMailSentSubscriber';
import { SaleReceiptMarkClosedOnMailSentSubcriber } from '@/services/Sales/Receipts/subscribers/SaleReceiptMarkClosedOnMailSentSubcriber';
import { SaleEstimateMarkApprovedOnMailSent } from '@/services/Sales/Estimates/subscribers/SaleEstimateMarkApprovedOnMailSent';
import { DeleteCashflowTransactionOnUncategorize } from '@/services/Cashflow/subscribers/DeleteCashflowTransactionOnUncategorize';
import { PreventDeleteTransactionOnDelete } from '@/services/Cashflow/subscribers/PreventDeleteTransactionsOnDelete';
import { SubscribeFreeOnSignupCommunity } from '@/services/Subscription/events/SubscribeFreeOnSignupCommunity';
import { SendVerfiyMailOnSignUp } from '@/services/Authentication/events/SendVerfiyMailOnSignUp';
import { AttachmentsOnSaleInvoiceCreated } from '@/services/Attachments/events/AttachmentsOnSaleInvoice';
import { AttachmentsOnSaleReceipt } from '@/services/Attachments/events/AttachmentsOnSaleReceipts';
import { AttachmentsOnManualJournals } from '@/services/Attachments/events/AttachmentsOnManualJournals';
import { AttachmentsOnExpenses } from '@/services/Attachments/events/AttachmentsOnExpenses';
import { AttachmentsOnBills } from '@/services/Attachments/events/AttachmentsOnBills';
import { AttachmentsOnPaymentsReceived } from '@/services/Attachments/events/AttachmentsOnPaymentsReceived';
import { AttachmentsOnVendorCredits } from '@/services/Attachments/events/AttachmentsOnVendorCredits';
import { AttachmentsOnCreditNote } from '@/services/Attachments/events/AttachmentsOnCreditNote';
import { AttachmentsOnBillPayments } from '@/services/Attachments/events/AttachmentsOnPaymentsMade';
import { AttachmentsOnSaleEstimates } from '@/services/Attachments/events/AttachmentsOnSaleEstimates';
import { TriggerRecognizedTransactions } from '@/services/Banking/RegonizeTranasctions/events/TriggerRecognizedTransactions';
import { ValidateMatchingOnExpenseDelete } from '@/services/Banking/Matching/events/ValidateMatchingOnExpenseDelete';
import { ValidateMatchingOnManualJournalDelete } from '@/services/Banking/Matching/events/ValidateMatchingOnManualJournalDelete';
import { ValidateMatchingOnPaymentReceivedDelete } from '@/services/Banking/Matching/events/ValidateMatchingOnPaymentReceivedDelete';
import { ValidateMatchingOnPaymentMadeDelete } from '@/services/Banking/Matching/events/ValidateMatchingOnPaymentMadeDelete';
import { ValidateMatchingOnCashflowDelete } from '@/services/Banking/Matching/events/ValidateMatchingOnCashflowDelete';
import { RecognizeSyncedBankTranasctions } from '@/services/Banking/Plaid/subscribers/RecognizeSyncedBankTransactions';
import { UnlinkBankRuleOnDeleteBankRule } from '@/services/Banking/Rules/events/UnlinkBankRuleOnDeleteBankRule';
import { DecrementUncategorizedTransactionOnMatching } from '@/services/Banking/Matching/events/DecrementUncategorizedTransactionsOnMatch';
import { DecrementUncategorizedTransactionOnExclude } from '@/services/Banking/Exclude/events/DecrementUncategorizedTransactionOnExclude';
import { DecrementUncategorizedTransactionOnCategorize } from '@/services/Cashflow/subscribers/DecrementUncategorizedTransactionOnCategorize';
import { DisconnectPlaidItemOnAccountDeleted } from '@/services/Banking/BankAccounts/events/DisconnectPlaidItemOnAccountDeleted';
import { LoopsEventsSubscriber } from '@/services/Loops/LoopsEventsSubscriber';
import { DeleteUncategorizedTransactionsOnAccountDeleting } from '@/services/Banking/BankAccounts/events/DeleteUncategorizedTransactionsOnAccountDeleting';

export default () => {
  return new EventPublisher();
};

export const susbcribers = () => {
  return [
    InventoryAdjustmentsSubscriber,
    BillWriteInventoryTransactionsSubscriber,
    PaymentSyncBillBalance,
    SaleReceiptInventoryTransactionsSubscriber,
    SaleReceiptWriteGLEntriesSubscriber,
    SaleInvoiceWriteInventoryTransactions,
    SaleInvoiceWriteGLEntriesSubscriber,
    PaymentReceiveSyncInvoices,
    PaymentReceivesWriteGLEntriesSubscriber,
    CashflowTransactionSubscriber,
    InventorySubscriber,
    CustomerWriteGLOpeningBalanceSubscriber,
    VendorsWriteGLOpeningSubscriber,

    // # Estimate
    SaleEstimateAutoSerialSubscriber,
    SaleEstimateSmsNotificationSubscriber,
    SaleEstimateMarkApprovedOnMailSent,

    ExpensesWriteGLSubscriber,
    SaleReceiptAutoSerialSubscriber,
    SaleInvoiceAutoIncrementSubscriber,
    SaleInvoiceConvertFromEstimateSubscriber,
    PaymentReceiveAutoSerialSubscriber,
    SyncSystemSendInvite,
    SyncTenantAcceptInvite,
    InviteSendMainNotification,
    SyncTenantUserMutate,
    SyncTenantUserDelete,
    OrgSyncTenantAdminUserSubscriber,
    OrgBuildSmsNotificationSubscriber,
    PurgeUserAbilityCache,
    ResetLoginThrottleSubscriber,
    AuthenticationSubscriber,
    PurgeAuthorizedUserOnceRoleMutate,
    SendSmsNotificationToCustomer,
    SendSmsNotificationSaleReceipt,
    SendSmsNotificationPaymentReceive,
    SaleInvoiceWriteoffSubscriber,
    LandedCostSyncCostTransactionsSubscriber,
    LandedCostInventoryTransactionsSubscriber,
    CreditNoteGLEntriesSubscriber,
    VendorCreditGlEntriesSubscriber,
    CreditNoteInventoryTransactionsSubscriber,
    VendorCreditInventoryTransactionsSubscriber,
    CreditNoteAutoSerialSubscriber,
    VendorCreditAutoSerialSubscriber,
    LandedCostGLEntriesSubscriber,
    RefundCreditNoteGLEntriesSubscriber,
    RefundVendorCreditGLEntriesSubscriber,
    RefundSyncCreditNoteBalanceSubscriber,
    RefundSyncVendorCreditBalanceSubscriber,
    CreditNoteApplySyncCreditSubscriber,
    CreditNoteApplySyncInvoicesCreditedAmountSubscriber,
    ApplyVendorCreditSyncInvoicedSubscriber,
    ApplyVendorCreditSyncBillsSubscriber,
    DeleteCustomerLinkedCreditSubscriber,
    DeleteVendorAssociatedVendorCredit,

    // # Inventory
    InventoryCostGLBeforeWriteSubscriber,

    // #Invoices
    InvoicePaymentGLRewriteSubscriber,
    InvoiceCostGLEntriesSubscriber,
    InvoiceChangeStatusOnMailSentSubscriber,

    BillPaymentsGLEntriesRewriteSubscriber,

    // # Receipts
    SaleReceiptCostGLEntriesSubscriber,
    SaleReceiptMarkClosedOnMailSentSubcriber,

    // Transaction locking.
    SalesTransactionLockingGuardSubscriber,
    PurchasesTransactionLockingGuardSubscriber,
    FinancialTransactionLockingGuardSubscriber,
    CashflowWithAccountSubscriber,

    // Warehouses
    WarehousesItemsQuantitySyncSubscriber,
    WarehouseTransferInventoryTransactionsSubscriber,
    WarehouseTransferAutoIncrementSubscriber,
    ActivateWarehousesSubscriber,

    // Branches.
    AccountsTransactionsWarehousesSubscribe,
    ...BranchesIntegrationsSubscribers(),
    ...WarehousesIntegrationsSubscribers(),

    // Manual Journals
    ManualJournalWriteGLSubscriber,

    // Bills
    BillGLEntriesSubscriber,
    PaymentWriteGLEntriesSubscriber,

    SeedInitialCurrenciesOnSetupSubsriber,
    MutateBaseCurrencyAccountsSubscriber,

    // # Projects
    SyncActualTimeTaskSubscriber,
    ProjectBillableTasksSubscriber,
    ProjectBillableExpensesSubscriber,
    ProjectBillableBillSubscriber,

    // Tax Rates - Sale Invoice
    SaleInvoiceTaxRateValidateSubscriber,
    WriteInvoiceTaxTransactionsSubscriber,

    // Tax Rates - Bills
    BillTaxRateValidateSubscriber,
    WriteBillTaxTransactionsSubscriber,

    SyncItemTaxRateOnEditTaxSubscriber,

    // Plaid
    PlaidUpdateTransactionsOnItemCreatedSubscriber,

    // Cashflow
    DeleteCashflowTransactionOnUncategorize,
    PreventDeleteTransactionOnDelete,

    SubscribeFreeOnSignupCommunity,
    SendVerfiyMailOnSignUp,

    // Attachments
    AttachmentsOnSaleInvoiceCreated,
    AttachmentsOnSaleEstimates,
    AttachmentsOnSaleReceipt,
    AttachmentsOnPaymentsReceived,
    AttachmentsOnCreditNote,
    AttachmentsOnVendorCredits,
    AttachmentsOnBills,
    AttachmentsOnBillPayments,
    AttachmentsOnManualJournals,
    AttachmentsOnExpenses,

    // Bank Rules
    TriggerRecognizedTransactions,
    UnlinkBankRuleOnDeleteBankRule,
    DecrementUncategorizedTransactionOnMatching,
    DecrementUncategorizedTransactionOnExclude,
    DecrementUncategorizedTransactionOnCategorize,

    // Validate matching
    ValidateMatchingOnCashflowDelete,
    ValidateMatchingOnExpenseDelete,
    ValidateMatchingOnManualJournalDelete,
    ValidateMatchingOnPaymentReceivedDelete,
    ValidateMatchingOnPaymentMadeDelete,

    // Plaid
    RecognizeSyncedBankTranasctions,
    DisconnectPlaidItemOnAccountDeleted,
    DeleteUncategorizedTransactionsOnAccountDeleting,

    // Loops
    LoopsEventsSubscriber
  ];
};
