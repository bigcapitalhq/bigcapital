import { Inject } from 'typedi';
import { ImportFileUploadService } from './ImportFileUpload';
import { ImportFileMapping } from './ImportFileMapping';
import { ImportMappingAttr } from './interfaces';
import { ImportFileProcess } from './ImportFileProcess';
import { ImportFilePreview } from './ImportFilePreview';

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

  /**
   * Reads the imported file and stores the import file meta under unqiue id.
   * @param {number} tenantId -
   * @param {string} resource - 
   * @param {string} fileName -
   * @returns {Promise<ImportFileUploadPOJO>}
   */
  public async import(
    tenantId: number,
    resource: string,
    filename: string
  ) {
    return this.importFileService.import(tenantId, resource, filename);
  }

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
    return this.importMappingService.mapping(tenantId, importId, maps);
  }

  /**
   * Preview the mapped results before process importing.
   * @param {number} tenantId
   * @param {number} importId
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
}
