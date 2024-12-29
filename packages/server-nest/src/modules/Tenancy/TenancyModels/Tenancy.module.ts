import { Knex } from 'knex';
import { Global, Module, Scope } from '@nestjs/common';
import { TENANCY_DB_CONNECTION } from '../TenancyDB/TenancyDB.constants';

import { Item } from '../../../modules/Items/models/Item';
import { Account } from '@/modules/Accounts/models/Account.model';
import { ItemEntry } from '@/modules/Items/models/ItemEntry';
import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { Expense } from '@/modules/Expenses/models/Expense.model';
import { ExpenseCategory } from '@/modules/Expenses/models/ExpenseCategory.model';
import { ItemCategory } from '@/modules/ItemCategories/models/ItemCategory.model';
import { TaxRateModel } from '@/modules/TaxRates/models/TaxRate.model';
import { PdfTemplateModel } from '@/modules/PdfTemplate/models/PdfTemplate';
import { Warehouse } from '@/modules/Warehouses/models/Warehouse.model';
import { ItemWarehouseQuantity } from '@/modules/Warehouses/models/ItemWarehouseQuantity';
import { Branch } from '@/modules/Branches/models/Branch.model';
import { SaleEstimate } from '@/modules/SaleEstimates/models/SaleEstimate';
import { Customer } from '@/modules/Customers/models/Customer';
import { Contact } from '@/modules/Contacts/models/Contact';
import { Document } from '@/modules/ChromiumlyTenancy/models/Document';
import { DocumentLink } from '@/modules/ChromiumlyTenancy/models/DocumentLink';
import { Vendor } from '@/modules/Vendors/models/Vendor';
import { Bill } from '@/modules/Bills/models/Bill';
import { BillPayment } from '@/modules/BillPayments/models/BillPayment';
import { BillPaymentEntry } from '@/modules/BillPayments/models/BillPaymentEntry';
import { BillLandedCostEntry } from '@/modules/BillLandedCosts/models/BillLandedCostEntry';
import { BillLandedCost } from '@/modules/BillLandedCosts/models/BillLandedCost';
import { VendorCreditAppliedBill } from '@/modules/VendorCreditsApplyBills/models/VendorCreditAppliedBill';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';
import { PaymentReceivedEntry } from '@/modules/PaymentReceived/models/PaymentReceivedEntry';
import { CreditNoteAppliedInvoice } from '@/modules/CreditNotesApplyInvoice/models/CreditNoteAppliedInvoice';
import { CreditNote } from '@/modules/CreditNotes/models/CreditNote';
import { PaymentLink } from '@/modules/PaymentLinks/models/PaymentLink';
import { SaleReceipt } from '@/modules/SaleReceipts/models/SaleReceipt';
import { ManualJournal } from '@/modules/ManualJournals/models/ManualJournal';
import { ManualJournalEntry } from '@/modules/ManualJournals/models/ManualJournalEntry';
import { RefundCreditNote } from '@/modules/CreditNoteRefunds/models/RefundCreditNote';
import { VendorCredit } from '@/modules/VendorCredit/models/VendorCredit';
import { RefundVendorCredit } from '@/modules/VendorCreditsRefund/models/RefundVendorCredit';

const models = [
  Item,
  Account,
  ItemEntry,
  AccountTransaction,
  Expense,
  ExpenseCategory,
  ItemCategory,
  TaxRateModel,
  PdfTemplateModel,
  Warehouse,
  ItemWarehouseQuantity,
  Branch,
  SaleEstimate,
  Customer,
  Contact,
  Document,
  DocumentLink,
  Vendor,
  Bill,
  BillPayment,
  BillPaymentEntry,
  BillLandedCost,
  BillLandedCostEntry,
  VendorCreditAppliedBill,
  SaleInvoice,
  PaymentReceivedEntry,
  CreditNoteAppliedInvoice,
  CreditNote,
  RefundCreditNote,
  PaymentLink,
  SaleReceipt,
  ManualJournal,
  ManualJournalEntry,
  VendorCredit,
  VendorCreditAppliedBill,
  RefundVendorCredit,

];

const modelProviders = models.map((model) => {
  return {
    provide: model.name,
    inject: [TENANCY_DB_CONNECTION],
    scope: Scope.REQUEST,
    useFactory: async (tenantKnex: Knex) => {
      return model.bindKnex(tenantKnex);
    },
  };
});

@Global()
@Module({
  providers: [...modelProviders],
  exports: [...modelProviders],
})
export class TenancyModelsModule {}
