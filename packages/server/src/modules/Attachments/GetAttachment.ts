import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { DocumentModel } from './models/Document.model';
import { StorageProvider } from '../Storage/StorageProvider';
import { STORAGE_PROVIDER } from '../Storage/Storage.module';

export interface AttachmentData {
  body: Buffer;
  contentType: string;
}

@Injectable()
export class GetAttachment {
  constructor(
    @Inject(STORAGE_PROVIDER)
    private readonly storageProvider: StorageProvider,

    @Inject(DocumentModel.name)
    private readonly documentModel: TenantModelProxy<typeof DocumentModel>,
  ) {}

  /**
   * Retrieves the file content for the given document key.
   * @param {string} filekey
   * @returns {Promise<AttachmentData>}
   */
  async getAttachment(filekey: string): Promise<AttachmentData> {
    const document = await this.documentModel()
      .query()
      .findOne('key', filekey)
      .throwIfNotFound();

    const { body } = await this.storageProvider.getObject(filekey);

    return {
      body,
      contentType: document.mimeType || 'application/octet-stream',
    };
  }
}
