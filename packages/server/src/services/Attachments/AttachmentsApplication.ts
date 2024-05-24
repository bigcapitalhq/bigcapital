import { Inject, Service } from 'typedi';
import { UploadDocument } from './UploadDocument';
import { DeleteAttachment } from './DeleteAttachment';
import { GetAttachment } from './GetAttachment';
import { AttachmentUploadPipeline } from './S3UploadPipeline';

@Service()
export class AttachmentsApplication {
  @Inject()
  private uploadDocumentService: UploadDocument;

  @Inject()
  private deleteDocumentService: DeleteAttachment;

  @Inject()
  private getDocumentService: GetAttachment;

  private uploadPipelineService: AttachmentUploadPipeline;

  /**
   * 
   * @returns 
   */
  get uploadPipeline() {
    return this.uploadPipelineService.uploadPipeline();
  }

  /**
   *
   * @param {number} tenantId
   * @param {} file
   * @returns
   */
  public upload(tenantId: number, file: any) {
    return this.uploadDocumentService.upload(tenantId, file);
  }

  /**
   * Deletes the give file attachment file key.
   * @param {number} tenantId
   * @param {string} documentKey
   * @returns {Promise<void>}
   */
  public delete(tenantId: number, documentKey: string) {
    return this.deleteDocumentService.delete(tenantId, documentKey);
  }

  /**
   * Retrieves the document data.
   * @param {number} tenantId
   * @param {string} documentKey
   */
  public get(tenantId: number, documentKey: string) {
    return this.getDocumentService.getAttachment(tenantId, documentKey);
  }
}
