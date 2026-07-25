import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { DocumentModel } from './models/Document.model';
import { StorageProvider } from '../Storage/StorageProvider';
import { STORAGE_PROVIDER } from '../Storage/Storage.module';

@Injectable()
export class GetAttachmentPresignedUrl {
  constructor(
    @Inject(STORAGE_PROVIDER)
    private readonly storageProvider: StorageProvider,

    @Inject(DocumentModel.name)
    private readonly documentModel: TenantModelProxy<typeof DocumentModel>,
  ) {}

  /**
   * Retrieves the presigned url of the given attachment key with the
   * original filename.
   * For S3 this returns a time-limited presigned URL; for local storage
   * this returns the authenticated API endpoint path.
   * @param {string} key
   * @returns {Promise<string>}
   */
  async getPresignedUrl(key: string): Promise<string> {
    const foundDocument = await this.documentModel()
      .query()
      .findOne({ key })
      .throwIfNotFound();

    return this.storageProvider.getPresignedUrl(key, {
      originalName: foundDocument.originName,
      expiresIn: 300,
    });
  }
}
