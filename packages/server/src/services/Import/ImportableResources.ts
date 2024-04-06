import Container, { Service } from 'typedi';
import { AccountsImportable } from '../Accounts/AccountsImportable';
import { ImportableRegistry } from './ImportableRegistry';
import { UncategorizedTransactionsImportable } from '../Cashflow/UncategorizedTransactionsImportable';
import { CustomersImportable } from '../Contacts/Customers/CustomersImportable';
import { VendorsImportable } from '../Contacts/Vendors/VendorsImportable';
import { ItemsImportable } from '../Items/ItemsImportable';
import { ItemCategoriesImportable } from '../ItemCategories/ItemCategoriesImportable';
import { ManualJournalImportable } from '../ManualJournals/ManualJournalsImport';
import { BillsImportable } from '../Purchases/Bills/BillsImportable';
import { ExpensesImportable } from '../Expenses/ExpensesImportable';
import { SaleInvoicesImportable } from '../Sales/Invoices/SaleInvoicesImportable';
import { SaleEstimatesImportable } from '../Sales/Estimates/SaleEstimatesImportable';
import { BillPaymentsImportable } from '../Purchases/BillPayments/BillPaymentsImportable';
import { VendorCreditsImportable } from '../Purchases/VendorCredits/VendorCreditsImportable';
import { PaymentReceivesImportable } from '../Sales/PaymentReceives/PaymentReceivesImportable';
import { CreditNotesImportable } from '../CreditNotes/CreditNotesImportable';
import { SaleReceiptsImportable } from '../Sales/Receipts/SaleReceiptsImportable';

@Service()
export class ImportableResources {
  private static registry: ImportableRegistry;

  constructor() {
    this.boot();
  }

  /**
   * Importable instances.
   */
  private importables = [
    { resource: 'Account', importable: AccountsImportable },
    {
      resource: 'UncategorizedCashflowTransaction',
      importable: UncategorizedTransactionsImportable,
    },
    { resource: 'Customer', importable: CustomersImportable },
    { resource: 'Vendor', importable: VendorsImportable },
    { resource: 'Item', importable: ItemsImportable },
    { resource: 'ItemCategory', importable: ItemCategoriesImportable },
    { resource: 'ManualJournal', importable: ManualJournalImportable },
    { resource: 'Bill', importable: BillsImportable },
    { resource: 'Expense', importable: ExpensesImportable },
    { resource: 'SaleInvoice', importable: SaleInvoicesImportable },
    { resource: 'SaleEstimate', importable: SaleEstimatesImportable },
    { resource: 'BillPayment', importable: BillPaymentsImportable },
    { resource: 'PaymentReceive', importable: PaymentReceivesImportable },
    { resource: 'VendorCredit', importable: VendorCreditsImportable },
    { resource: 'CreditNote', importable: CreditNotesImportable },
    { resource: 'SaleReceipt', importable: SaleReceiptsImportable }
  ];

  public get registry() {
    return ImportableResources.registry;
  }

  /**
   * Boots all the registered importables.
   */
  public boot() {
    if (!ImportableResources.registry) {
      const instance = ImportableRegistry.getInstance();

      this.importables.forEach((importable) => {
        const importableInstance = Container.get(importable.importable);
        instance.registerImportable(importable.resource, importableInstance);
      });
      ImportableResources.registry = instance;
    }
  }
}
