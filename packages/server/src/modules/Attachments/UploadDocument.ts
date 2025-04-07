import { Inject, Injectable } from '@nestjs/common';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { DocumentModel } from './models/Document.model';

@Injectable()
export class UploadDocument {
  constructor(
    @Inject(DocumentModel.name)
    private readonly documentModel: TenantModelProxy<typeof DocumentModel>,
  ) {}

  /**
   * Inserts the document metadata.
   * @param {number} tenantId
   * @param {} file
   * @returns {}
   */
  async upload(file: any) {
    const insertedDocument = await this.documentModel().query().insert({
      key: file.key,
      mimeType: file.mimetype,
      size: file.size,
      originName: file.originalname,
    });
    return insertedDocument;
  }
}
