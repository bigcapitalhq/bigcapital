import { Inject, Service } from 'typedi';
import {
  deleteImportFile,
  getResourceColumns,
  readImportFile,
  sanitizeResourceName,
  validateSheetEmpty,
} from './_utils';
import ResourceService from '../Resource/ResourceService';
import { ImportFileCommon } from './ImportFileCommon';
import { ImportFileDataValidator } from './ImportFileDataValidator';
import { ImportFileUploadPOJO } from './interfaces';
import { Import } from '@/system/models';
import { parseSheetData } from './sheet_utils';

@Service()
export class ImportFileUploadService {
  @Inject()
  private resourceService: ResourceService;

  @Inject()
  private importFileCommon: ImportFileCommon;

  @Inject()
  private importValidator: ImportFileDataValidator;

  /**
   * Imports the specified file for the given resource.
   * Deletes the file if an error occurs during the import process.
   * @param {number} tenantId
   * @param {string} resourceName
   * @param {string} filename
   * @param {Record<string, number | string>} params
   * @returns {Promise<ImportFileUploadPOJO>}
   */
  public async import(
    tenantId: number,
    resourceName: string,
    filename: string,
    params: Record<string, number | string>
  ): Promise<ImportFileUploadPOJO> {
    try {
      return await this.importUnhandled(
        tenantId,
        resourceName,
        filename,
        params
      );
    } catch (err) {
      deleteImportFile(filename);
      throw err;
    }
  }

  /**
   * Reads the imported file and stores the import file meta under unqiue id.
   * @param {number} tenantId - Tenant id.
   * @param {string} resource - Resource name.
   * @param {string} filePath - File path.
   * @param {string} fileName - File name.
   * @returns {Promise<ImportFileUploadPOJO>}
   */
  public async importUnhandled(
    tenantId: number,
    resourceName: string,
    filename: string,
    params: Record<string, number | string>
  ): Promise<ImportFileUploadPOJO> {
    const resource = sanitizeResourceName(resourceName);
    const resourceMeta = this.resourceService.getResourceMeta(
      tenantId,
      resource
    );
    // Throw service error if the resource does not support importing.
    this.importValidator.validateResourceImportable(resourceMeta);

    // Reads the imported file into buffer.
    const buffer = await readImportFile(filename);

    // Parse the buffer file to array data.
    const [sheetData, sheetColumns] = parseSheetData(buffer);
    const coumnsStringified = JSON.stringify(sheetColumns);

    // Throws service error if the sheet data is empty.
    validateSheetEmpty(sheetData);

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
      tenantId,
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
