import { Injectable } from "@nestjs/common";
import { ExportableRegistry } from "./ExportRegistery";
import { AccountsExportable } from "../Accounts/AccountsExportable.service";

@Injectable()
export class ExportableResources {
  constructor(
    private readonly exportRegistry: ExportableRegistry,
  ) {
    this.boot();
  }

  /**
   * Importable instances.
   */
  private importables = [
    // { resource: 'Account', exportable: AccountsExportable },
    // { resource: 'Item', exportable: ItemsExportable },
    // { resource: 'ItemCategory', exportable: ItemCategoriesExportable },
    // { resource: 'Customer', exportable: CustomersExportable },
    // { resource: 'Vendor', exportable: VendorsExportable },
    // { resource: 'Expense', exportable: ExpensesExportable },
    // { resource: 'SaleInvoice', exportable: SaleInvoicesExportable },
    // { resource: 'SaleEstimate', exportable: SaleEstimatesExportable },
    // { resource: 'SaleReceipt', exportable: SaleReceiptsExportable },
    // { resource: 'Bill', exportable: BillsExportable },
    // { resource: 'PaymentReceive', exportable: PaymentsReceivedExportable },
    // { resource: 'BillPayment', exportable: BillPaymentExportable },
    // { resource: 'ManualJournal', exportable: ManualJournalsExportable },
    // { resource: 'CreditNote', exportable: CreditNotesExportable },
    // { resource: 'VendorCredit', exportable: VendorCreditsExportable },
    // { resource: 'TaxRate', exportable: TaxRatesExportable },
  ];

  /**
   *
   */
  public get registry() {
    return ExportableResources.registry;
  }

  /**
   * Boots all the registered importables.
   */
  public boot() {
    if (!ExportableResources.registry) {
      const instance = ExportableRegistry.getInstance();

      this.importables.forEach((importable) => {
        const importableInstance = Container.get(importable.exportable);
        instance.registerExportable(importable.resource, importableInstance);
      });
      ExportableResources.registry = instance;
    }
  }
}
