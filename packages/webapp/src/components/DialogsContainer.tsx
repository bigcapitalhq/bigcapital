import AccountDialog from '@/containers/Dialogs/AccountDialog';
import InviteUserDialog from '@/containers/Dialogs/InviteUserDialog';
import UserFormDialog from '@/containers/Dialogs/UserFormDialog';
import ItemCategoryDialog from '@/containers/Dialogs/ItemCategoryDialog';
import CurrencyFormDialog from '@/containers/Dialogs/CurrencyFormDialog';
import InventoryAdjustmentDialog from '@/containers/Dialogs/InventoryAdjustmentFormDialog';
import KeyboardShortcutsDialog from '@/containers/Dialogs/keyboardShortcutsDialog';
import ContactDuplicateDialog from '@/containers/Dialogs/ContactDuplicateDialog';
import QuickPaymentReceiveFormDialog from '@/containers/Dialogs/QuickPaymentReceiveFormDialog';
import QuickPaymentMadeFormDialog from '@/containers/Dialogs/QuickPaymentMadeFormDialog';
import AllocateLandedCostDialog from '@/containers/Dialogs/AllocateLandedCostDialog';
import InvoicePdfPreviewDialog from '@/containers/Dialogs/InvoicePdfPreviewDialog';
import EstimatePdfPreviewDialog from '@/containers/Dialogs/EstimatePdfPreviewDialog';
import ReceiptPdfPreviewDialog from '@/containers/Dialogs/ReceiptPdfPreviewDialog';
import MoneyInDialog from '@/containers/CashFlow/MoneyInDialog';
import MoneyOutDialog from '@/containers/CashFlow/MoneyOutDialog';
import BadDebtDialog from '@/containers/Dialogs/BadDebtDialog';
import NotifyInvoiceViaSMSDialog from '@/containers/Dialogs/NotifyInvoiceViaSMSDialog';
import NotifyReceiptViaSMSDialog from '@/containers/Dialogs/NotifyReceiptViaSMSDialog';
import NotifyEstimateViaSMSDialog from '@/containers/Dialogs/NotifyEstimateViaSMSDialog';
import NotifyPaymentReceiveViaSMSDialog from '@/containers/Dialogs/NotifyPaymentReceiveViaSMSDialog';
import SMSMessageDialog from '@/containers/Dialogs/SMSMessageDialog';
import RefundCreditNoteDialog from '@/containers/Dialogs/RefundCreditNoteDialog';
import RefundVendorCreditDialog from '@/containers/Dialogs/RefundVendorCreditDialog';
import ReconcileCreditNoteDialog from '@/containers/Dialogs/ReconcileCreditNoteDialog';
import ReconcileVendorCreditDialog from '@/containers/Dialogs/ReconcileVendorCreditDialog';
import LockingTransactionsDialog from '@/containers/Dialogs/LockingTransactionsDialog';
import UnlockingTransactionsDialog from '@/containers/Dialogs/UnlockingTransactionsDialog';
import UnlockingPartialTransactionsDialog from '@/containers/Dialogs/UnlockingPartialTransactionsDialog';
import CreditNotePdfPreviewDialog from '@/containers/Dialogs/CreditNotePdfPreviewDialog';
import PaymentReceivePdfPreviewDialog from '@/containers/Dialogs/PaymentReceivePdfPreviewDialog';
import WarehouseFormDialog from '@/containers/Dialogs/WarehouseFormDialog';
import BranchFormDialog from '@/containers/Dialogs/BranchFormDialog';
import BranchActivateDialog from '@/containers/Dialogs/BranchActivateDialog';
import WarehouseActivateDialog from '@/containers/Dialogs/WarehouseActivateDialog';
import CustomerOpeningBalanceDialog from '@/containers/Dialogs/CustomerOpeningBalanceDialog';
import VendorOpeningBalanceDialog from '@/containers/Dialogs/VendorOpeningBalanceDialog';
import ProjectFormDialog from '@/containers/Projects/containers/ProjectFormDialog';
import ProjectTaskFormDialog from '@/containers/Projects/containers/ProjectTaskFormDialog';
import ProjectTimeEntryFormDialog from '@/containers/Projects/containers/ProjectTimeEntryFormDialog';
import ProjectExpenseForm from '@/containers/Projects/containers/ProjectExpenseForm';
import EstimatedExpenseFormDialog from '@/containers/Projects/containers/EstimatedExpenseFormDialog';
import ProjectInvoicingFormDialog from '@/containers/Projects/containers/ProjectInvoicingFormDialog';
import ProjectBillableEntriesFormDialog from '@/containers/Projects/containers/ProjectBillableEntriesFormDialog';
import TaxRateFormDialog from '@/containers/TaxRates/dialogs/TaxRateFormDialog/TaxRateFormDialog';
import { DialogsName } from '@/constants/dialogs';
import InvoiceExchangeRateChangeDialog from '@/containers/Sales/Invoices/InvoiceForm/Dialogs/InvoiceExchangeRateChangeDialog';
import InvoiceMailDialog from '@/containers/Sales/Invoices/InvoiceMailDialog/InvoiceMailDialog';
import EstimateMailDialog from '@/containers/Sales/Estimates/EstimateMailDialog/EstimateMailDialog';
import ReceiptMailDialog from '@/containers/Sales/Receipts/ReceiptMailDialog/ReceiptMailDialog';
import PaymentMailDialog from '@/containers/Sales/PaymentsReceived/PaymentMailDialog/PaymentMailDialog';
import { ExportDialog } from '@/containers/Dialogs/ExportDialog';
import { RuleFormDialog } from '@/containers/Banking/Rules/RuleFormDialog/RuleFormDialog';
import { DisconnectBankAccountDialog } from '@/containers/CashFlow/AccountTransactions/dialogs/DisconnectBankAccountDialog/DisconnectBankAccountDialog';

/**
 * Dialogs container.
 */
export default function DialogsContainer() {
  return (
    <div>
      <AccountDialog dialogName={DialogsName.AccountForm} />
      <CurrencyFormDialog dialogName={DialogsName.CurrencyForm} />
      <InviteUserDialog dialogName={DialogsName.InviteForm} />
      <UserFormDialog dialogName={DialogsName.UserForm} />
      <ItemCategoryDialog dialogName={DialogsName.ItemCategoryForm} />
      <InventoryAdjustmentDialog
        dialogName={DialogsName.InventoryAdjustmentForm}
      />
      <KeyboardShortcutsDialog dialogName={DialogsName.KeyboardShortcutForm} />
      <ContactDuplicateDialog dialogName={DialogsName.ContactDuplicateForm} />
      <QuickPaymentReceiveFormDialog
        dialogName={DialogsName.QuickPaymentReceiveForm}
      />
      <QuickPaymentMadeFormDialog
        dialogName={DialogsName.QuickPaymentMadeForm}
      />
      <AllocateLandedCostDialog
        dialogName={DialogsName.AllocateLandedCostForm}
      />
      <InvoicePdfPreviewDialog dialogName={DialogsName.InvoicePdfForm} />
      <EstimatePdfPreviewDialog dialogName={DialogsName.EstimatePdfForm} />
      <ReceiptPdfPreviewDialog dialogName={DialogsName.ReceiptPdfForm} />
      <MoneyInDialog dialogName={DialogsName.MoneyInForm} />
      <MoneyOutDialog dialogName={DialogsName.MoneyOutForm} />

      <NotifyInvoiceViaSMSDialog
        dialogName={DialogsName.NotifyInvoiceViaForm}
      />
      <NotifyReceiptViaSMSDialog
        dialogName={DialogsName.NotifyReceiptViaForm}
      />
      <NotifyEstimateViaSMSDialog
        dialogName={DialogsName.NotifyEstimateViaForm}
      />
      <NotifyPaymentReceiveViaSMSDialog
        dialogName={DialogsName.NotifyPaymentViaForm}
      />
      <BadDebtDialog dialogName={DialogsName.BadDebtForm} />
      <SMSMessageDialog dialogName={DialogsName.SMSMessageForm} />
      <RefundCreditNoteDialog dialogName={DialogsName.RefundCreditNote} />
      <RefundVendorCreditDialog dialogName={DialogsName.RefundVendorCredit} />
      <ReconcileCreditNoteDialog dialogName={DialogsName.ReconcileCreditNote} />
      <ReconcileVendorCreditDialog
        dialogName={DialogsName.ReconcileVendorCredit}
      />
      <LockingTransactionsDialog dialogName={DialogsName.TransactionsLocking} />
      <UnlockingTransactionsDialog
        dialogName={DialogsName.TransactionsUnlocking}
      />
      <UnlockingPartialTransactionsDialog
        dialogName={DialogsName.PartialTransactionsUnlocking}
      />
      <CreditNotePdfPreviewDialog dialogName={DialogsName.CreditNotePdfForm} />
      <PaymentReceivePdfPreviewDialog dialogName={DialogsName.PaymentPdfForm} />
      <WarehouseFormDialog dialogName={DialogsName.WarehouseForm} />
      <BranchFormDialog dialogName={DialogsName.BranchForm} />
      <BranchActivateDialog dialogName={DialogsName.BranchActivateForm} />
      <WarehouseActivateDialog dialogName={DialogsName.WarehouseActivateForm} />
      <CustomerOpeningBalanceDialog
        dialogName={DialogsName.CustomerOpeningBalanceForm}
      />
      <VendorOpeningBalanceDialog
        dialogName={DialogsName.VendorOpeningBalanceForm}
      />
      <ProjectFormDialog dialogName={DialogsName.ProjectForm} />
      <ProjectTaskFormDialog dialogName={DialogsName.ProjectTaskForm} />
      <ProjectTimeEntryFormDialog
        dialogName={DialogsName.ProjectTimeEntryForm}
      />
      <ProjectExpenseForm dialogName={DialogsName.ProjectExpenseForm} />
      <EstimatedExpenseFormDialog
        dialogName={DialogsName.EstimateExpenseForm}
      />
      <ProjectInvoicingFormDialog
        dialogName={DialogsName.ProjectInvoicingForm}
      />
      <ProjectBillableEntriesFormDialog
        dialogName={DialogsName.ProjectBillableEntriesForm}
      />
      <TaxRateFormDialog dialogName={DialogsName.TaxRateForm} />
      <InvoiceExchangeRateChangeDialog
        dialogName={DialogsName.InvoiceExchangeRateChangeNotice}
      />
      <InvoiceMailDialog dialogName={DialogsName.InvoiceMail} />
      <EstimateMailDialog dialogName={DialogsName.EstimateMail} />
      <ReceiptMailDialog dialogName={DialogsName.ReceiptMail} />
      <PaymentMailDialog dialogName={DialogsName.PaymentMail} />
      <ExportDialog dialogName={DialogsName.Export} />
      <RuleFormDialog dialogName={DialogsName.BankRuleForm} />
      <DisconnectBankAccountDialog
        dialogName={DialogsName.DisconnectBankAccountConfirmation}
      />
    </div>
  );
}
