import { camelCase, upperFirst } from 'lodash';
import { Importable } from './Importable';

export class ImportableRegistry {
  private static instance: ImportableRegistry;
  private importables: Record<string, Importable>;

  constructor() {
    this.importables = {};
  }

  /**
   * Gets singleton instance of registry.
   * @returns {ImportableRegistry}
   */
  public static getInstance(): ImportableRegistry {
    if (!ImportableRegistry.instance) {
      ImportableRegistry.instance = new ImportableRegistry();
    }
    return ImportableRegistry.instance;
  }

  /**
   * Registers the given importable service.
   * @param {string} resource 
   * @param {Importable} importable 
   */
  public registerImportable(resource: string, importable: Importable): void {
    const _resource = this.sanitizeResourceName(resource);
    this.importables[_resource] = importable;
  }

  /**
   * Retrieves the importable service instance of the given resource name.
   * @param {string} name 
   * @returns {Importable}
   */
  public getImportable(name: string): Importable {
    const _name = this.sanitizeResourceName(name);
    return this.importables[_name];
  }

  private sanitizeResourceName(resource: string) {
    return upperFirst(camelCase(resource));
  }
}
