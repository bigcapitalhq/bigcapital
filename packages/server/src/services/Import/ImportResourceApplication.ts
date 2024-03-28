import { Inject } from 'typedi';
import { ImportFileUploadService } from './ImportFileUpload';
import { ImportFileMapping } from './ImportFileMapping';
import { ImportMappingAttr } from './interfaces';
import { ImportFileProcess } from './ImportFileProcess';
import { ImportFilePreview } from './ImportFilePreview';
import { ImportSampleService } from './ImportSample';
import { ImportFileMeta } from './ImportFileMeta';

@Inject()
export class ImportResourceApplication {
  @Inject()
  private importFileService: ImportFileUploadService;

  @Inject()
  private importMappingService: ImportFileMapping;

  @Inject()
  private importProcessService: ImportFileProcess;

  @Inject()
  private ImportFilePreviewService: ImportFilePreview;

  @Inject()
  private importSampleService: ImportSampleService;

  @Inject()
  private importMetaService: ImportFileMeta;

  /**
   * Reads the imported file and stores the import file meta under unqiue id.
   * @param {number} tenantId -
   * @param {string} resource - Resource name.
   * @param {string} fileName - File name.
   * @returns {Promise<ImportFileUploadPOJO>}
   */
  public async import(
    tenantId: number,
    resource: string,
    filename: string,
    params: Record<string, any>
  ) {
    return this.importFileService.import(tenantId, resource, filename, params);
  }

  /**
   * Mapping the excel sheet columns with resource columns.
   * @param {number} tenantId
   * @param {number} importId - Import id.
   * @param {ImportMappingAttr} maps
   */
  public async mapping(
    tenantId: number,
    importId: number,
    maps: ImportMappingAttr[]
  ) {
    return this.importMappingService.mapping(tenantId, importId, maps);
  }

  /**
   * Preview the mapped results before process importing.
   * @param {number} tenantId
   * @param {number} importId - Import id.
   * @returns {Promise<ImportFilePreviewPOJO>}
   */
  public async preview(tenantId: number, importId: number) {
    return this.ImportFilePreviewService.preview(tenantId, importId);
  }

  /**
   * Process the import file sheet through service for creating entities.
   * @param {number} tenantId
   * @param {number} importId
   * @returns {Promise<ImportFilePreviewPOJO>}
   */
  public async process(tenantId: number, importId: number) {
    return this.importProcessService.import(tenantId, importId);
  }

  /**
   * Retrieves the import meta of the given import id.
   * @param {number} tenantId - 
   * @param {string} importId - Import id.
   * @returns {}
   */
  public importMeta(tenantId: number, importId: string) {
    return this.importMetaService.getImportMeta(tenantId, importId);
  }

  /**
   * Retrieves the csv/xlsx sample sheet of the given
   * @param {number} tenantId
   * @param {number} resource - Resource name.
   */
  public sample(
    tenantId: number,
    resource: string,
    format: 'csv' | 'xlsx' = 'csv'
  ) {
    return this.importSampleService.sample(tenantId, resource, format);
  }
}
