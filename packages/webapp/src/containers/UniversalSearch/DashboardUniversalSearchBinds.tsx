// @ts-nocheck
import { universalSearchInvoiceBind } from '../Sales/Invoices/InvoiceUniversalSearch';
import { universalSearchReceiptBind } from '../Sales/Receipts/ReceiptUniversalSearch';
import { universalSearchBillBind } from '../Purchases/Bills/BillUniversalSearch';
import { universalSearchEstimateBind } from '../Sales/Estimates/EstimatesLanding/EstimateUniversalSearch';
import { universalSearchPaymentReceiveBind } from '../Sales/PaymentReceives/PaymentReceiveUniversalSearch';
import { universalSearchPaymentMadeBind } from '../Purchases/PaymentsMade/PaymentMadeUniversalSearch';
import { universalSearchItemBind } from '../Items/ItemsUniversalSearch';
import { universalSearchCustomerBind } from '../Customers/CustomersUniversalSearch';
import { universalSearchJournalBind } from '../Accounting/ManualJournalUniversalSearch';
import { universalSearchAccountBind } from '../Accounts/AccountUniversalSearch';
import { universalSearchVendorBind } from '../Vendors/VendorsUniversalSearch';
import { universalSearchCreditNoteBind } from '../Sales/CreditNotes/CreditNoteUniversalSearch';
import { universalSearchVendorCreditBind } from '../Purchases/CreditNotes/VendorCreditIUniversalSearchBind';

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
