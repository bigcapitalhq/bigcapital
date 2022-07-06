import { universalSearchInvoiceBind } from '@/containers/Sales/Invoices/InvoiceUniversalSearch';
import { universalSearchReceiptBind } from '@/containers/Sales/Receipts/ReceiptUniversalSearch';
import { universalSearchBillBind } from '@/containers/Purchases/Bills/BillUniversalSearch';
import { universalSearchEstimateBind } from '@/containers/Sales/Estimates/EstimatesLanding/EstimateUniversalSearch';
import { universalSearchPaymentReceiveBind } from '@/containers/Sales/PaymentReceives/PaymentReceiveUniversalSearch';
import { universalSearchPaymentMadeBind } from '@/containers/Purchases/PaymentMades/PaymentMadeUniversalSearch';
import { universalSearchItemBind } from '@/containers/Items/ItemsUniversalSearch';
import { universalSearchCustomerBind } from '@/containers/Customers/CustomersUniversalSearch';
import { universalSearchJournalBind } from '@/containers/Accounting/ManualJournalUniversalSearch';
import { universalSearchAccountBind } from '@/containers/Accounts/AccountUniversalSearch';
import { universalSearchVendorBind } from '@/containers/Vendors/VendorsUniversalSearch';
import { universalSearchCreditNoteBind } from '@/containers/Sales/CreditNotes/CreditNoteUniversalSearch';
import { universalSearchVendorCreditBind } from '@/containers/Purchases/CreditNotes/VendorCreditIUniversalSearchBind';

// Universal search binds.
export const universalSearchBinds = [
  universalSearchItemBind,
  universalSearchAccountBind,
  universalSearchInvoiceBind,
  universalSearchReceiptBind,
  universalSearchEstimateBind,
  universalSearchBillBind,
  universalSearchPaymentReceiveBind,
  universalSearchPaymentMadeBind,
  universalSearchCustomerBind,
  universalSearchVendorBind,
  universalSearchJournalBind,
  universalSearchCreditNoteBind,
  universalSearchVendorCreditBind,
];
