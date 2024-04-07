import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import {
  getResourceColumns,
  sanitizeResourceName,
  validateSheetEmpty,
} from './_utils';
import ResourceService from '../Resource/ResourceService';
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
    filename: string,
    params: Record<string, number | string>
  ): Promise<ImportFileUploadPOJO> {
    const { Import } = this.tenancy.models(tenantId);

    const resource = sanitizeResourceName(resourceName);
    const resourceMeta = this.resourceService.getResourceMeta(
      tenantId,
      resource
    );
    // Throw service error if the resource does not support importing.
    this.importValidator.validateResourceImportable(resourceMeta);

    // Reads the imported file into buffer.
    const buffer = await this.importFileCommon.readImportFile(filename);

    // Parse the buffer file to array data.
    const sheetData = this.importFileCommon.parseXlsxSheet(buffer);

    // Throws service error if the sheet data is empty.
    validateSheetEmpty(sheetData);

    const sheetColumns = this.importFileCommon.parseSheetColumns(sheetData);
    const coumnsStringified = JSON.stringify(sheetColumns);

    try {
      // Validates the params Yup schema.
      await this.importFileCommon.validateParamsSchema(resource, params);

      // Validates importable params asyncly.
      await this.importFileCommon.validateParams(tenantId, resource, params);
    } catch (error) {
      throw error;
    }
    const _params = this.importFileCommon.transformParams(resource, params);
    const paramsStringified = JSON.stringify(_params);

    // Store the import model with related metadata.
    const importFile = await Import.query().insert({
      filename,
      resource,
      importId: filename,
      columns: coumnsStringified,
      params: paramsStringified,
    });
    const resourceColumnsMap = this.resourceService.getResourceFields2(
      tenantId,
      resource
    );
    const resourceColumns = getResourceColumns(resourceColumnsMap);

    return {
      import: {
        importId: importFile.importId,
        resource: importFile.resource,
      },
      sheetColumns,
      resourceColumns,
    };
  }
}
