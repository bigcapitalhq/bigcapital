import {
  CreditNoteActivateBranchesSubscriber,
  PaymentReceiveActivateBranchesSubscriber,
  SaleEstimatesActivateBranchesSubscriber,
  SaleInvoicesActivateBranchesSubscriber,
  PaymentMadeActivateBranchesSubscriber,
  SaleReceiptsActivateBranchesSubscriber,
} from './Subscribers/Activate';
import {
  BillBranchValidateSubscriber,
  VendorCreditBranchValidateSubscriber,
  PaymentMadeBranchValidateSubscriber,
  SaleEstimateBranchValidateSubscriber,
  CreditNoteBranchValidateSubscriber,
  ExpenseBranchValidateSubscriber,
  SaleReceiptBranchValidateSubscriber,
  ManualJournalBranchValidateSubscriber,
  PaymentReceiveBranchValidateSubscriber,
  CreditNoteRefundBranchValidateSubscriber,
  CashflowBranchDTOValidatorSubscriber,
  VendorCreditRefundBranchValidateSubscriber,
  InvoiceBranchValidateSubscriber,
  ContactBranchValidateSubscriber,
  InventoryAdjustmentBranchValidateSubscriber
} from './Subscribers/Validators';

export default () => [
  BillBranchValidateSubscriber,
  CreditNoteBranchValidateSubscriber,
  ExpenseBranchValidateSubscriber,
  PaymentMadeBranchValidateSubscriber,
  SaleReceiptBranchValidateSubscriber,
  VendorCreditBranchValidateSubscriber,
  SaleEstimateBranchValidateSubscriber,
  ManualJournalBranchValidateSubscriber,
  PaymentReceiveBranchValidateSubscriber,
  CreditNoteRefundBranchValidateSubscriber,
  VendorCreditRefundBranchValidateSubscriber,

  CreditNoteActivateBranchesSubscriber,
  PaymentReceiveActivateBranchesSubscriber,
  SaleEstimatesActivateBranchesSubscriber,
  SaleInvoicesActivateBranchesSubscriber,
  PaymentMadeActivateBranchesSubscriber,
  SaleReceiptsActivateBranchesSubscriber,
  CashflowBranchDTOValidatorSubscriber,
  InvoiceBranchValidateSubscriber,
  ContactBranchValidateSubscriber,
  InventoryAdjustmentBranchValidateSubscriber
];
