import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { ImportMappingAttr } from './interfaces';

@Service()
export class ImportFileMapping {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Mapping the excel sheet columns with resource columns.
   * @param {number} tenantId
   * @param {number} importId
   * @param {ImportMappingAttr} maps
   */
  public async mapping(
    tenantId: number,
    importId: number,
    maps: ImportMappingAttr[]
  ) {
    const { Import } = this.tenancy.models(tenantId);

    const importFile = await Import.query()
      .findOne('filename', importId)
      .throwIfNotFound();

    // @todo validate the resource columns.
    // @todo validate the sheet columns.

    const mappingStringified = JSON.stringify(maps);

    await Import.query().findById(importFile.id).patch({
      mapping: mappingStringified,
    });
  }
}
