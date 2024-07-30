import { Inject, Service } from 'typedi';
import { UploadDocument } from './UploadDocument';
import { DeleteAttachment } from './DeleteAttachment';
import { GetAttachment } from './GetAttachment';
import { LinkAttachment } from './LinkAttachment';
import { UnlinkAttachment } from './UnlinkAttachment';
import { getAttachmentPresignedUrl } from './GetAttachmentPresignedUrl';

@Service()
export class AttachmentsApplication {
  @Inject()
  private uploadDocumentService: UploadDocument;

  @Inject()
  private deleteDocumentService: DeleteAttachment;

  @Inject()
  private getDocumentService: GetAttachment;

  @Inject()
  private linkDocumentService: LinkAttachment;

  @Inject()
  private unlinkDocumentService: UnlinkAttachment;

  @Inject()
  private getPresignedUrlService: getAttachmentPresignedUrl;

  /**
   * Saves the metadata of uploaded document to S3 on database.
   * @param {number} tenantId
   * @param {} file
   * @returns {Promise<Document>}
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

  /**
   * Links the given document to resource model.
   * @param {number} tenantId
   * @param {string} filekey
   * @param {string} modelRef
   * @param {number} modelId
   * @returns
   */
  public link(
    tenantId: number,
    filekey: string,
    modelRef: string,
    modelId: number
  ) {
    return this.linkDocumentService.link(tenantId, filekey, modelRef, modelId);
  }

  /**
   * Unlinks the given document from resource model.
   * @param {number} tenantId
   * @param {string} filekey
   * @param {string} modelRef
   * @param {number} modelId
   * @returns
   */
  public unlink(
    tenantId: number,
    filekey: string,
    modelRef: string,
    modelId: number
  ) {
    return this.unlinkDocumentService.unlink(
      tenantId,
      filekey,
      modelRef,
      modelId
    );
  }

  /**
   * Retrieves the presigned url of the given attachment key.
   * @param {number} tenantId
   * @param {string} key
   * @returns {Promise<string>}
   */
  public getPresignedUrl(tenantId: number, key: string): Promise<string> {
    return this.getPresignedUrlService.getPresignedUrl(tenantId, key);
  }
}
