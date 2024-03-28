import Container, { Service } from 'typedi';
import { AccountsImportable } from '../Accounts/AccountsImportable';
import { ImportableRegistry } from './ImportableRegistry';
import { UncategorizedTransactionsImportable } from '../Cashflow/UncategorizedTransactionsImportable';
import { CustomersImportable } from '../Contacts/Customers/CustomersImportable';
import { VendorsImportable } from '../Contacts/Vendors/VendorsImportable';

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
