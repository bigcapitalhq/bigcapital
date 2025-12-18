import { camelCase, upperFirst } from 'lodash';
import { Importable } from './Importable';
import { getImportableService } from './decorators/Import.decorator';
import { Injectable } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';

@Injectable()
export class ImportableRegistry {
  constructor(private readonly moduleRef: ModuleRef) { }
  /**
   * Retrieves the importable service instance of the given resource name.
   * @param {string} name
   * @returns {Importable}
   */
  public async getImportable(name: string) {
    const _name = this.sanitizeResourceName(name);
    const importable = getImportableService(_name);

    if (!importable) {
      throw new Error(
        `No importable service found for resource "${_name}". Make sure the resource has an @ImportableService decorator registered.`,
      );
    }
    const contextId = ContextIdFactory.create();

    const importableInstance = await this.moduleRef.resolve(importable, contextId, {
      strict: false,
    });
    return importableInstance;
  }

  private sanitizeResourceName(resource: string) {
    return upperFirst(camelCase(resource));
  }
}
