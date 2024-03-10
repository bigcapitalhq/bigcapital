import { Inject } from 'typedi';
import { ImportFileUploadService } from './ImportFileUpload';

@Inject()
export class ImportResourceApplication {
  @Inject()
  private importFileService: ImportFileUploadService;

  /**
   * Reads the imported file and stores the import file meta under unqiue id.
   * @param {number} tenantId -
   * @param {string} filePath -
   * @param {string} fileName -
   * @returns
   */
  public async import(
    tenantId: number,
    resource: string,
    filePath: string,
    filename: string
  ) {
    return this.importFileService.import(
      tenantId,
      resource,
      filePath,
      filename
    );
  }
}
