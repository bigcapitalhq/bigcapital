import { DialogsName } from '@/constants/dialogs';
import { RuleFormDialog } from '@/containers/Banking/Rules/RuleFormDialog/RuleFormDialog';
import { DisconnectBankAccountDialog } from '@/containers/CashFlow/AccountTransactions/dialogs/DisconnectBankAccountDialog/DisconnectBankAccountDialog';
import { index as MoneyInDialog } from '@/containers/CashFlow/MoneyInDialog';
import { index as MoneyOutDialog } from '@/containers/CashFlow/MoneyOutDialog';
import { index as AccountDialog } from '@/containers/Dialogs/AccountDialog';
import { index as AllocateLandedCostDialog } from '@/containers/Dialogs/AllocateLandedCostDialog';
import { ApiKeysGenerateDialog } from '@/containers/Dialogs/ApiKeysGenerateDialog';
import { index as BadDebtDialog } from '@/containers/Dialogs/BadDebtDialog';
import { index as BranchActivateDialog } from '@/containers/Dialogs/BranchActivateDialog';
import { index as BranchFormDialog } from '@/containers/Dialogs/BranchFormDialog';
import { index as ContactDuplicateDialog } from '@/containers/Dialogs/ContactDuplicateDialog';
import { index as CurrencyFormDialog } from '@/containers/Dialogs/CurrencyFormDialog';
import { index as CustomerOpeningBalanceDialog } from '@/containers/Dialogs/CustomerOpeningBalanceDialog';
import { ExportDialog } from '@/containers/Dialogs/ExportDialog';
import { index as InventoryAdjustmentDialog } from '@/containers/Dialogs/InventoryAdjustmentFormDialog';
import { index as InviteUserDialog } from '@/containers/Dialogs/InviteUserDialog';
import { index as ItemCategoryDialog } from '@/containers/Dialogs/ItemCategoryDialog';
import { index as KeyboardShortcutsDialog } from '@/containers/Dialogs/keyboardShortcutsDialog';
import { index as LockingTransactionsDialog } from '@/containers/Dialogs/LockingTransactionsDialog';
import { index as NotifyEstimateViaSMSDialog } from '@/containers/Dialogs/NotifyEstimateViaSMSDialog';
import { index as NotifyInvoiceViaSMSDialog } from '@/containers/Dialogs/NotifyInvoiceViaSMSDialog';
import { index as NotifyPaymentReceiveViaSMSDialog } from '@/containers/Dialogs/NotifyPaymentReceiveViaSMSDialog';
import { index as NotifyReceiptViaSMSDialog } from '@/containers/Dialogs/NotifyReceiptViaSMSDialog';
import { index as QuickPaymentMadeFormDialog } from '@/containers/Dialogs/QuickPaymentMadeFormDialog';
import { index as QuickPaymentReceiveFormDialog } from '@/containers/Dialogs/QuickPaymentReceiveFormDialog';
import { index as ReconcileCreditNoteDialog } from '@/containers/Dialogs/ReconcileCreditNoteDialog';
import { index as ReconcileVendorCreditDialog } from '@/containers/Dialogs/ReconcileVendorCreditDialog';
import { index as RefundCreditNoteDialog } from '@/containers/Dialogs/RefundCreditNoteDialog';
import { index as RefundVendorCreditDialog } from '@/containers/Dialogs/RefundVendorCreditDialog';
import { index as SMSMessageDialog } from '@/containers/Dialogs/SMSMessageDialog';
import { index as UnlockingPartialTransactionsDialog } from '@/containers/Dialogs/UnlockingPartialTransactionsDialog';
import { index as UnlockingTransactionsDialog } from '@/containers/Dialogs/UnlockingTransactionsDialog';
import { index as UserFormDialog } from '@/containers/Dialogs/UserFormDialog';
import { index as VendorOpeningBalanceDialog } from '@/containers/Dialogs/VendorOpeningBalanceDialog';
import { index as WarehouseActivateDialog } from '@/containers/Dialogs/WarehouseActivateDialog';
import { index as WarehouseFormDialog } from '@/containers/Dialogs/WarehouseFormDialog';
import { SelectPaymentMethodsDialog } from '@/containers/PaymentLink/dialogs/SelectPaymentMethodsDialog/SelectPaymentMethodsDialog';
import { SharePaymentLinkDialog } from '@/containers/PaymentLink/dialogs/SharePaymentLinkDialog/SharePaymentLinkDialog';
import { index as EstimatedExpenseFormDialog } from '@/containers/Projects/containers/EstimatedExpenseFormDialog';
import { index as ProjectBillableEntriesFormDialog } from '@/containers/Projects/containers/ProjectBillableEntriesFormDialog';
import { index as ProjectExpenseForm } from '@/containers/Projects/containers/ProjectExpenseForm';
import { index as ProjectFormDialog } from '@/containers/Projects/containers/ProjectFormDialog';
import { index as ProjectInvoicingFormDialog } from '@/containers/Projects/containers/ProjectInvoicingFormDialog';
import { index as ProjectTaskFormDialog } from '@/containers/Projects/containers/ProjectTaskFormDialog';
import { index as ProjectTimeEntryFormDialog } from '@/containers/Projects/containers/ProjectTimeEntryFormDialog';
import { TaxRateFormDialog } from '@/containers/TaxRates/dialogs/TaxRateFormDialog/TaxRateFormDialog';
import WorkspaceDeleteDialog from '@/ee/workspaces/containers/Dialogs/WorkspaceDeleteDialog';
import WorkspaceInactivateDialog from '@/ee/workspaces/containers/Dialogs/WorkspaceInactivateDialog';

/**
 * Dialogs container.
 *
 * Hosts dialogs that are cross-cutting or feature-scoped without a single
 * clear page home. Page-scoped and form-scoped dialogs are mounted in
 * co-located `<Page>Dialogs` / `<PageForm>Dialogs` components.
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
      <ExportDialog dialogName={DialogsName.Export} />
      <RuleFormDialog dialogName={DialogsName.BankRuleForm} />
      <DisconnectBankAccountDialog
        dialogName={DialogsName.DisconnectBankAccountConfirmation}
      />
      <SharePaymentLinkDialog dialogName={DialogsName.SharePaymentLink} />
      <SelectPaymentMethodsDialog
        dialogName={DialogsName.SelectPaymentMethod}
      />
      <ApiKeysGenerateDialog dialogName={DialogsName.ApiKeysGenerate} />
      <WorkspaceDeleteDialog dialogName={DialogsName.WorkspaceDelete} />
      <WorkspaceInactivateDialog dialogName={DialogsName.WorkspaceInactivate} />
    </div>
  );
}
