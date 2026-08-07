// @ts-nocheck
import { universalSearchJournalBind } from '../Accounting/ManualJournalUniversalSearch';
import { universalSearchAccountBind } from '../Accounts/AccountUniversalSearch';
import { universalSearchCustomerBind } from '../Customers/CustomersUniversalSearch';
import { universalSearchItemBind } from '../Items/ItemsUniversalSearch';
import { universalSearchBillBind } from '../Purchases/Bills/BillUniversalSearch';
import { universalSearchVendorCreditBind } from '../Purchases/CreditNotes/VendorCreditIUniversalSearchBind';
import { universalSearchPaymentMadeBind } from '../Purchases/PaymentsMade/PaymentsMadeUniversalSearch';
import { universalSearchCreditNoteBind } from '../Sales/CreditNotes/CreditNoteUniversalSearch';
import { universalSearchEstimateBind } from '../Sales/Estimates/EstimatesLanding/EstimateUniversalSearch';
import { universalSearchInvoiceBind } from '../Sales/Invoices/InvoiceUniversalSearch';
import { universalSearchPaymentReceiveBind } from '../Sales/PaymentsReceived/PaymentReceiveUniversalSearch';
import { universalSearchReceiptBind } from '../Sales/Receipts/ReceiptUniversalSearch';
import { universalSearchVendorBind } from '../Vendors/VendorsUniversalSearch';

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
