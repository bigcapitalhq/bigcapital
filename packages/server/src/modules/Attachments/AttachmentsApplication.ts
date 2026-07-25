import { Injectable } from '@nestjs/common';
import { UploadDocument } from './UploadDocument';
import { DeleteAttachment } from './DeleteAttachment';
import { GetAttachment, AttachmentData } from './GetAttachment';
import { LinkAttachment } from './LinkAttachment';
import { UnlinkAttachment } from './UnlinkAttachment';
import { GetAttachmentPresignedUrl } from './GetAttachmentPresignedUrl';

@Injectable()
export class AttachmentsApplication {
  constructor(
    private readonly uploadDocumentService: UploadDocument,
    private readonly deleteDocumentService: DeleteAttachment,
    private readonly getDocumentService: GetAttachment,
    private readonly linkDocumentService: LinkAttachment,
    private readonly unlinkDocumentService: UnlinkAttachment,
    private readonly getPresignedUrlService: GetAttachmentPresignedUrl,
  ) {}

  /**
   * Saves the metadata of uploaded document on database.
   * @param {} file
   * @returns {Promise<Document>}
   */
  public upload(file: any) {
    return this.uploadDocumentService.upload(file);
  }

  /**
   * Deletes the give file attachment file key.
   * @param {string} documentKey
   * @returns {Promise<void>}
   */
  public delete(documentKey: string) {
    return this.deleteDocumentService.delete(documentKey);
  }

  /**
   * Retrieves the document data.
   * @param {string} documentKey
   * @returns {Promise<AttachmentData>}
   */
  public get(documentKey: string): Promise<AttachmentData> {
    return this.getDocumentService.getAttachment(documentKey);
  }

  /**
   * Links the given document to resource model.
   * @param {string} filekey
   * @param {string} modelRef
   * @param {number} modelId
   * @returns
   */
  public link(filekey: string, modelRef: string, modelId: number) {
    return this.linkDocumentService.link(filekey, modelRef, modelId);
  }

  /**
   * Unlinks the given document from resource model.
   * @param {string} filekey
   * @param {string} modelRef
   * @param {number} modelId
   * @returns
   */
  public unlink(filekey: string, modelRef: string, modelId: number) {
    return this.unlinkDocumentService.unlink(filekey, modelRef, modelId);
  }

  /**
   * Retrieves the presigned url of the given attachment key.
   * @param {string} key
   * @returns {Promise<string>}
   */
  public getPresignedUrl(key: string): Promise<string> {
    return this.getPresignedUrlService.getPresignedUrl(key);
  }
}
