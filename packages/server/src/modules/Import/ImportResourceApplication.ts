import { ImportFileUploadService } from './ImportFileUpload';
import { ImportFileMapping } from './ImportFileMapping';
import { ImportMappingAttr } from './interfaces';
import { ImportFileProcess } from './ImportFileProcess';
import { ImportFilePreview } from './ImportFilePreview';
import { ImportSampleService } from './ImportSample';
import { ImportFileMeta } from './ImportFileMeta';
import { ImportFileProcessCommit } from './ImportFileProcessCommit';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImportResourceApplication {
  constructor(
    private readonly importFileService: ImportFileUploadService,
    private readonly importMappingService: ImportFileMapping,
    private readonly importProcessService: ImportFileProcess,
    private readonly ImportFilePreviewService: ImportFilePreview,
    private readonly importSampleService: ImportSampleService,
    private readonly importMetaService: ImportFileMeta,
    private readonly importProcessCommit: ImportFileProcessCommit,
  ) {}

  /**
   * Reads the imported file and stores the import file meta under unqiue id.
   * @param {string} resource - Resource name.
   * @param {string} fileName - File name.
   * @returns {Promise<ImportFileUploadPOJO>}
   */
  public async import(
    resource: string,
    filename: string,
    params: Record<string, any>,
  ) {
    return this.importFileService.import(resource, filename, params);
  }

  /**
   * Mapping the excel sheet columns with resource columns.
   * @param {number} importId - Import id.
   * @param {ImportMappingAttr} maps
   */
  public async mapping(importId: string, maps: ImportMappingAttr[]) {
    return this.importMappingService.mapping(importId, maps);
  }

  /**
   * Preview the mapped results before process importing.
   * @param {number} importId - Import id.
   * @returns {Promise<ImportFilePreviewPOJO>}
   */
  public async preview(importId: string) {
    return this.ImportFilePreviewService.preview(importId);
  }

  /**
   * Process the import file sheet through service for creating entities.
   * @param {number} importId
   * @returns {Promise<ImportFilePreviewPOJO>}
   */
  public async process(importId: string) {
    return this.importProcessCommit.commit(importId);
  }

  /**
   * Retrieves the import meta of the given import id.
   * @param {string} importId - Import id.
   * @returns {}
   */
  public importMeta(importId: string) {
    return this.importMetaService.getImportMeta(importId);
  }

  /**
   * Retrieves the csv/xlsx sample sheet of the given
   * @param {number} resource - Resource name.
   */
  public sample(resource: string, format: 'csv' | 'xlsx' = 'csv') {
    return this.importSampleService.sample(resource, format);
  }
}
