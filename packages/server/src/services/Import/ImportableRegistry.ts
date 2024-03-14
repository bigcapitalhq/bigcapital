import { camelCase, upperFirst } from 'lodash';

export class ImportableRegistry {
  private static instance: ImportableRegistry;
  private importables: Record<string, any>;

  private constructor() {
    this.importables = {};
  }

  public static getInstance(): ImportableRegistry {
    if (!ImportableRegistry.instance) {
      ImportableRegistry.instance = new ImportableRegistry();
    }
    return ImportableRegistry.instance;
  }

  public registerImportable(resource: string, importable: any): void {
    const _resource = this.sanitizeResourceName(resource);
    this.importables[_resource] = importable;
  }

  public getImportable(name: string): any {
    const _name = this.sanitizeResourceName(name);
    return this.importables[_name];
  }

  private sanitizeResourceName(resource: string) {
    return upperFirst(camelCase(resource));
  }
}
