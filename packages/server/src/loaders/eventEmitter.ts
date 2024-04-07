import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';

import { AccountsTransactionsWarehousesSubscribe } from '@/services/Accounting/AccountsTransactionsWarehousesSubscribe';
import { MutateBaseCurrencyAccountsSubscriber } from '@/services/Accounts/susbcribers/MutateBaseCurrencyAccounts';
import { PlaidUpdateTransactionsOnItemCreatedSubscriber } from '@/services/Banking/Plaid/subscribers/PlaidUpdateTransactionsOnItemCreatedSubscriber';
import BranchesIntegrationsSubscribers from '@/services/Branches/EventsProvider';
import CashflowTransactionSubscriber from '@/services/Cashflow/CashflowTransactionSubscriber';
import CashflowWithAccountSubscriber from '@/services/Cashflow/CashflowWithAccountSubscriber';
import { DeleteCashflowTransactionOnUncategorize } from '@/services/Cashflow/subscribers/DeleteCashflowTransactionOnUncategorize';
import { PreventDeleteTransactionOnDelete } from '@/services/Cashflow/subscribers/PreventDeleteTransactionsOnDelete';
import { CustomerWriteGLOpeningBalanceSubscriber } from '@/services/Contacts/Customers/Subscribers/CustomerGLEntriesSubscriber';
import { VendorsWriteGLOpeningSubscriber } from '@/services/Contacts/Vendors/Subscribers/VendorGLEntriesSubscriber';
import CreditNoteApplySyncCreditSubscriber from '@/services/CreditNotes/CreditNoteApplySyncCreditSubscriber';
import CreditNoteApplySyncInvoicesCreditedAmountSubscriber from '@/services/CreditNotes/CreditNoteApplySyncInvoicesSubscriber';
import CreditNoteAutoSerialSubscriber from '@/services/CreditNotes/CreditNoteAutoSerialSubscriber';
import CreditNoteGLEntriesSubscriber from '@/services/CreditNotes/CreditNoteGLEntriesSubscriber';
import CreditNoteInventoryTransactionsSubscriber from '@/services/CreditNotes/CreditNoteInventoryTransactionsSubscriber';
import DeleteCustomerLinkedCreditSubscriber from '@/services/CreditNotes/DeleteCustomerLinkedCreditSubscriber';
import RefundCreditNoteGLEntriesSubscriber from '@/services/CreditNotes/RefundCreditNoteGLEntriesSubscriber';
import RefundSyncCreditNoteBalanceSubscriber from '@/services/CreditNotes/RefundSyncCreditNoteBalanceSubscriber';
import { SeedInitialCurrenciesOnSetupSubsriber } from '@/services/Currencies/subscribers/SeedInitialCurrenciesOnSetupSubscriber';
import { ExpensesWriteGLSubscriber } from '@/services/Expenses/ExpenseGLEntriesSubscriber';
import { InventoryCostGLBeforeWriteSubscriber } from '@/services/Inventory/subscribers/InventoryCostGLBeforeWriteSubscriber';
import InviteSendMainNotification from '@/services/InviteUsers/InviteSendMailNotificationSubscribe';
import SyncSystemSendInvite from '@/services/InviteUsers/SyncSystemSendInvite';
import SyncTenantAcceptInvite from '@/services/InviteUsers/SyncTenantAcceptInvite';
import { ManualJournalWriteGLSubscriber } from '@/services/ManualJournals/ManualJournalGLEntriesSubscriber';
import { ProjectBillableBillSubscriber } from '@/services/Projects/Projects/ProjectBillableBillSubscriber';
import { ProjectBillableExpensesSubscriber } from '@/services/Projects/Projects/ProjectBillableExpenseSubscriber';
import { ProjectBillableTasksSubscriber } from '@/services/Projects/Projects/ProjectBillableTasksSubscriber';
import { SyncActualTimeTaskSubscriber } from '@/services/Projects/Times/SyncActualTimeTaskSubscriber';
import { PaymentWriteGLEntriesSubscriber } from '@/services/Purchases/BillPayments/BillPaymentGLEntriesSubscriber';
import { BillGLEntriesSubscriber } from '@/services/Purchases/Bills/BillGLEntriesSubscriber';
import { BillPaymentsGLEntriesRewriteSubscriber } from '@/services/Purchases/Bills/BillPaymentsGLEntriesRewriteSubscriber';
import LandedCostGLEntriesSubscriber from '@/services/Purchases/LandedCost/LandedCostGLEntriesSubscriber';
import LandedCostInventoryTransactionsSubscriber from '@/services/Purchases/LandedCost/LandedCostInventoryTransactionsSubscriber';
import LandedCostSyncCostTransactionsSubscriber from '@/services/Purchases/LandedCost/LandedCostSyncCostTransactionsSubscriber';
import ApplyVendorCreditSyncBillsSubscriber from '@/services/Purchases/VendorCredits/ApplyVendorCreditToBills/ApplyVendorCreditSyncBillsSubscriber';
import ApplyVendorCreditSyncInvoicedSubscriber from '@/services/Purchases/VendorCredits/ApplyVendorCreditToBills/ApplyVendorCreditSyncInvoicedSubscriber';
import DeleteVendorAssociatedVendorCredit from '@/services/Purchases/VendorCredits/DeleteVendorAssociatedVendorCredit';
import RefundSyncVendorCreditBalanceSubscriber from '@/services/Purchases/VendorCredits/RefundVendorCredits/RefundSyncVendorCreditBalanceSubscriber';
import RefundVendorCreditGLEntriesSubscriber from '@/services/Purchases/VendorCredits/RefundVendorCredits/RefundVendorCreditGLEntriesSubscriber';
import VendorCreditAutoSerialSubscriber from '@/services/Purchases/VendorCredits/VendorCreditAutoSerialSubscriber';
import VendorCreditGlEntriesSubscriber from '@/services/Purchases/VendorCredits/VendorCreditGLEntriesSubscriber';
import VendorCreditInventoryTransactionsSubscriber from '@/services/Purchases/VendorCredits/VendorCreditInventoryTransactionsSusbcriber';
import PurgeAuthorizedUserOnceRoleMutate from '@/services/Roles/PurgeAuthorizedUser';
import { SaleEstimateMarkApprovedOnMailSent } from '@/services/Sales/Estimates/subscribers/SaleEstimateMarkApprovedOnMailSent';
import SaleInvoiceWriteoffSubscriber from '@/services/Sales/Invoices/SaleInvoiceWriteoffSubscriber';
import { InvoiceChangeStatusOnMailSentSubscriber } from '@/services/Sales/Invoices/subscribers/InvoiceChangeStatusOnMailSentSubscriber';
import { InvoiceCostGLEntriesSubscriber } from '@/services/Sales/Invoices/subscribers/InvoiceCostGLEntriesSubscriber';
import { InvoicePaymentGLRewriteSubscriber } from '@/services/Sales/Invoices/subscribers/InvoicePaymentGLRewriteSubscriber';
import { SaleReceiptCostGLEntriesSubscriber } from '@/services/Sales/Receipts/subscribers/SaleReceiptCostGLEntriesSubscriber';
import { SaleReceiptMarkClosedOnMailSentSubcriber } from '@/services/Sales/Receipts/subscribers/SaleReceiptMarkClosedOnMailSentSubcriber';
import { SyncItemTaxRateOnEditTaxSubscriber } from '@/services/TaxRates/SyncItemTaxRateOnEditTaxSubscriber';
import { BillTaxRateValidateSubscriber } from '@/services/TaxRates/subscribers/BillTaxRateValidateSubscriber';
import { SaleInvoiceTaxRateValidateSubscriber } from '@/services/TaxRates/subscribers/SaleInvoiceTaxRateValidateSubscriber';
import { WriteBillTaxTransactionsSubscriber } from '@/services/TaxRates/subscribers/WriteBillTaxTransactionsSubscriber';
import { WriteInvoiceTaxTransactionsSubscriber } from '@/services/TaxRates/subscribers/WriteInvoiceTaxTransactionsSubscriber';
import FinancialTransactionLockingGuardSubscriber from '@/services/TransactionsLocking/FinancialsTransactionLockingGuardSubscriber';
import PurchasesTransactionLockingGuardSubscriber from '@/services/TransactionsLocking/PurchasesTransactionLockingGuardSubscriber';
import SalesTransactionLockingGuardSubscriber from '@/services/TransactionsLocking/SalesTransactionLockingGuardSubscriber';
import PurgeUserAbilityCache from '@/services/Users/PurgeUserAbilityCache';
import { SyncTenantUserDelete } from '@/services/Users/SyncTenantUserDeleted';
import SyncTenantUserMutate from '@/services/Users/SyncTenantUserSaved';
import { ActivateWarehousesSubscriber } from '@/services/Warehouses/ActivateWarehousesSubscriber';
import WarehousesIntegrationsSubscribers from '@/services/Warehouses/EventsProvider';
import { WarehousesItemsQuantitySyncSubscriber } from '@/services/Warehouses/Integrations/WarehousesItemsQuantitySynSubscriber';
import { WarehouseTransferAutoIncrementSubscriber } from '@/services/Warehouses/WarehousesTransfers/WarehouseTransferAutoIncrementSubscriber';
import { WarehouseTransferInventoryTransactionsSubscriber } from '@/services/Warehouses/WarehousesTransfers/WarehouseTransferInventoryTransactionsSubscriber';
import ResetLoginThrottleSubscriber from '@/subscribers/Authentication/ResetLoginThrottle';
import AuthenticationSubscriber from '@/subscribers/Authentication/SendResetPasswordMail';
import BillWriteInventoryTransactionsSubscriber from '@/subscribers/Bills/WriteInventoryTransactions';
import InventorySubscriber from '@/subscribers/Inventory/Inventory';
import InventoryAdjustmentsSubscriber from '@/subscribers/Inventory/InventoryAdjustment';
import OrgBuildSmsNotificationSubscriber from '@/subscribers/Organization/BuildSmsNotification';
import OrgSyncTenantAdminUserSubscriber from '@/subscribers/Organization/SyncTenantAdminUser';
import PaymentSyncBillBalance from '@/subscribers/PaymentMades/PaymentSyncBillBalance';
import PaymentReceiveAutoSerialSubscriber from '@/subscribers/PaymentReceive/AutoSerialIncrement';
import PaymentReceiveSyncInvoices from '@/subscribers/PaymentReceive/PaymentReceiveSyncInvoices';
import SendSmsNotificationPaymentReceive from '@/subscribers/PaymentReceive/SendSmsNotificationToCustomer';
import PaymentReceivesWriteGLEntriesSubscriber from '@/subscribers/PaymentReceive/WriteGLEntries';
import SaleEstimateAutoSerialSubscriber from '@/subscribers/SaleEstimate/AutoIncrementSerial';
import SaleEstimateSmsNotificationSubscriber from '@/subscribers/SaleEstimate/SmsNotifications';
import SaleInvoiceAutoIncrementSubscriber from '@/subscribers/SaleInvoices/AutoIncrementSerial';
import SaleInvoiceConvertFromEstimateSubscriber from '@/subscribers/SaleInvoices/ConvertFromEstimate';
import SendSmsNotificationToCustomer from '@/subscribers/SaleInvoices/SendSmsNotificationToCustomer';
import SaleInvoiceWriteInventoryTransactions from '@/subscribers/SaleInvoices/WriteInventoryTransactions';
import SaleInvoiceWriteGLEntriesSubscriber from '@/subscribers/SaleInvoices/WriteJournalEntries';
import SaleReceiptAutoSerialSubscriber from '@/subscribers/SaleReceipt/AutoIncrementSerial';
import SendSmsNotificationSaleReceipt from '@/subscribers/SaleReceipt/SendSmsNotificationToCustomer';
import SaleReceiptInventoryTransactionsSubscriber from '@/subscribers/SaleReceipt/WriteInventoryTransactions';
import SaleReceiptWriteGLEntriesSubscriber from '@/subscribers/SaleReceipt/WriteJournalEntries';

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
  ];
};
