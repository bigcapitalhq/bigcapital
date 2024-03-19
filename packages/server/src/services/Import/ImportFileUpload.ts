import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { sanitizeResourceName } from './_utils';
import ResourceService from '../Resource/ResourceService';
import { IModelMetaField } from '@/interfaces';
import { ImportFileCommon } from './ImportFileCommon';
import { ImportFileDataValidator } from './ImportFileDataValidator';
import { ImportFileUploadPOJO } from './interfaces';

@Service()
export class ImportFileUploadService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private resourceService: ResourceService;

  @Inject()
  private importFileCommon: ImportFileCommon;

  @Inject()
  private importValidator: ImportFileDataValidator;

  /**
   * Reads the imported file and stores the import file meta under unqiue id.
   * @param {number} tenantId - Tenant id.
   * @param {string} resource - Resource name.
   * @param {string} filePath - File path.
   * @param {string} fileName - File name.
   * @returns {Promise<ImportFileUploadPOJO>}
   */
  public async import(
    tenantId: number,
    resourceName: string,
    filename: string
  ): Promise<ImportFileUploadPOJO> {
    const { Import } = this.tenancy.models(tenantId);

    const resourceMeta = this.resourceService.getResourceMeta(
      tenantId,
      resourceName
    );
    // Throw service error if the resource does not support importing.
    this.importValidator.validateResourceImportable(resourceMeta);

    // Reads the imported file into buffer.
    const buffer = await this.importFileCommon.readImportFile(filename);

    // Parse the buffer file to array data.
    const sheetData = this.importFileCommon.parseXlsxSheet(buffer);

    const sheetColumns = this.importFileCommon.parseSheetColumns(sheetData);
    const coumnsStringified = JSON.stringify(sheetColumns);

    const _resourceName = sanitizeResourceName(resourceName);

    // Store the import model with related metadata.
    const importFile = await Import.query().insert({
      filename,
      importId: filename,
      resource: _resourceName,
      columns: coumnsStringified,
    });
    const resourceColumns = this.resourceService.getResourceImportableFields(
      tenantId,
      _resourceName
    );
    const resourceColumnsTransformeed = Object.entries(resourceColumns).map(
      ([key, { name }]: [string, IModelMetaField]) => ({ key, name })
    );
    return {
      import: {
        importId: importFile.importId,
        resource: importFile.resource,
      },
      sheetColumns,
      resourceColumns: resourceColumnsTransformeed,
    };
  }
}
