import { camelCase, upperFirst } from 'lodash';
import { Exportable } from './Exportable';

export class ExportableRegistry {
  private static instance: ExportableRegistry;
  private exportables: Record<string, Exportable>;

  /**
   * Constructor method.
   */
  constructor() {
    this.exportables = {};
  }

  /**
   * Gets singleton instance of registry.
   * @returns {ExportableRegistry}
   */
  public static getInstance(): ExportableRegistry {
    if (!ExportableRegistry.instance) {
      ExportableRegistry.instance = new ExportableRegistry();
    }
    return ExportableRegistry.instance;
  }

  /**
   * Registers the given importable service.
   * @param {string} resource
   * @param {Exportable} importable
   */
  public registerExportable(resource: string, importable: Exportable): void {
    const _resource = this.sanitizeResourceName(resource);
    this.exportables[_resource] = importable;
  }

  /**
   * Retrieves the importable service instance of the given resource name.
   * @param {string} name
   * @returns {Exportable}
   */
  public getExportable(name: string): Exportable {
    const _name = this.sanitizeResourceName(name);
    return this.exportables[_name];
  }

  private sanitizeResourceName(resource: string) {
    return upperFirst(camelCase(resource));
  }
}
