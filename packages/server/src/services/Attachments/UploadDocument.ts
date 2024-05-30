import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';

@Service()
export class UploadDocument {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Inserts the document metadata.
   * @param {number} tenantId 
   * @param {} file 
   * @returns {}
   */
  async upload(tenantId: number, file: any) {
    const { Document } = this.tenancy.models(tenantId);

    const insertedDocument = await Document.query().insert({
      key: file.key,
      mimeType: file.mimetype,
      size: file.size,
      originName: file.originalname,
    });
    return insertedDocument;
  }
}
