import Container, { Service } from 'typedi';
import { AccountsExportable } from '../Accounts/AccountsExportable';
import { ExportableRegistry } from './ExportRegistery';
import { ItemsImportable } from '../Items/ItemsImportable';
import { ItemsExportable } from '../Items/ItemsExportable';

@Service()
export class ExportableResources {
  private static registry: ExportableRegistry;

  constructor() {
    this.boot();
  }

  /**
   * Importable instances.
   */
  private importables = [
    { resource: 'Account', exportable: AccountsExportable },
    { resource: 'Item', exportable: ItemsExportable },
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
